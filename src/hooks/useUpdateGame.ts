import { useDispatch } from 'react-redux';
import { getAddress, type Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getPublicClient, readContracts } from 'wagmi/actions';
import { GameResult } from '../constants/game_result';
import { Stage } from '../constants/stages';
import { abi } from '../contracts/rps';
import { getInternalTransactions, type RawTransaction } from '../libs/etherscan';
import { Events, notify } from '../libs/notify';
import { parseSolidityDate } from '../libs/time';
import { store } from '../providers/AccountStoreProvider';
import { contractDeployed, contractVariablesRead, gameFinished, GameState, stageChanged } from '../store/gamesSlice';
import useReadP1SolveInputs from './useReadP1SolveInputs';
import useValidateContract from './useValidateContract';

const computeGameResult = (internalTxs: RawTransaction[], game: GameState) => {
  if (internalTxs.length === 2) return GameResult.DRAW;

  const to = getAddress(internalTxs[0].to);
  if (game.p1 === to) return GameResult.P1_WINS;
  return GameResult.P2_WINS;
};

/**
 * Provides a function that checks the current situation of the game and updates the Redux state
 * accordingly.
 *
 * @returns {Function} When invoked, fetches the game current situation and updates the state
 *
 * @example
 * const updateGame = useUpdateGame();
 *
 * <Button onClick={() => updateGame('0x...')}>Update the game status</Button>
 */
export const useUpdateGame = () => {
  const dispatch = useDispatch();
  const config = useConfig();
  const validateContract = useValidateContract();
  const getP1SolveInputs = useReadP1SolveInputs();

  return async (contractTransaction: Hash) => {
    const games = store.getState().games;
    const game = games[contractTransaction];

    if (!game) return notify(Events.GAME_NOT_FOUND_ERROR, contractTransaction);

    const publicClient = getPublicClient(config);
    if (!publicClient) return notify(Events.GENERIC_ERROR, contractTransaction);

    let { contractAddress } = game;
    if (!contractAddress) {
      const validation = await validateContract(contractTransaction);
      if (!validation) return;
      if (!validation.isValid) {
        dispatch(
          gameFinished({
            contractTransaction,
            result: GameResult.INVALID,
          }),
        );
        return notify(Events.UNEXPECTED_CONTRACT_ERROR, contractTransaction);
      }

      contractAddress = validation.contractAddress;
      notify(Events.GAME_START, contractTransaction);
      dispatch(
        contractDeployed({
          contractTransaction,
          contractAddress: validation.contractAddress,
        }),
      );
    }

    const gameContract = {
      address: contractAddress as Hash,
      abi,
    };

    const [storedValueRaw, p2Weapon, lastActionRaw] = await readContracts(config, {
      allowFailure: false,
      contracts: [
        { functionName: 'stake', ...gameContract },
        { functionName: 'c2', ...gameContract },
        { functionName: 'lastAction', ...gameContract },
      ],
    });

    const storedValue = String(storedValueRaw);
    const lastAction = parseSolidityDate(lastActionRaw).toISOString();

    dispatch(
      contractVariablesRead({
        contractTransaction,
        storedValue: String(storedValue),
        p2Weapon,
        lastAction,
      }),
    );

    if (storedValueRaw < BigInt(game.stake)) {
      dispatch(
        stageChanged({
          contractTransaction,
          stage: Stage.WAITING_RESULT,
        }),
      );

      const internalTxs = await getInternalTransactions(contractAddress);

      // Etherscan takes a while sometimes
      if (!internalTxs) return;
      const gameResult = computeGameResult(internalTxs, game);

      let solveInputs;
      if (!game.p1Weapon) {
        solveInputs = await getP1SolveInputs(game);
        if (!solveInputs) return;
      }

      notify(Events.GAME_END, contractTransaction);
      return dispatch(
        gameFinished({
          contractTransaction,
          result: gameResult,
          ...(solveInputs || {}),
        }),
      );
    }

    const nextStage = p2Weapon ? Stage.P2_MOVED : Stage.STARTED;
    return dispatch(
      stageChanged({
        contractTransaction,
        stage: nextStage,
      }),
    );
  };
};

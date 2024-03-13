import { useDispatch } from 'react-redux';
import { type Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getPublicClient, readContracts } from 'wagmi/actions';
import { GameResult } from '../constants/game_result';
import { Stage } from '../constants/stages';
import { abi } from '../contracts/rps';
import { Events, notify } from '../libs/notify';
import { parseSolidityDate } from '../libs/time';
import { store } from '../providers/AccountStoreProvider';
import { contractDeployed, contractVariablesRead, gameFinished, stageChanged } from '../store/gamesSlice';
import useCheckGameEnd from './useCheckGameEnd';
import useValidateContract from './useValidateContract';

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
  const checkGameEnd = useCheckGameEnd();

  return async (contractTransaction: Hash) => {
    const games = store.getState().games;
    const game = games[contractTransaction];

    if (!game) return notify(Events.GAME_NOT_FOUND_ERROR, contractTransaction);

    const publicClient = getPublicClient(config);
    if (!publicClient) return notify(Events.GENERIC_ERROR, contractTransaction);

    let { contractAddress, startingBlock } = game;
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
      startingBlock = validation.startingBlock.toString();
      notify(Events.GAME_START, contractTransaction);
      dispatch(
        contractDeployed({
          contractTransaction,
          contractAddress,
          startingBlock,
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

    const stake = BigInt(game.stake);
    // In games with stakes, the end can be detected by a distribution
    // of funds. On games without stakes, we need to check always
    if (storedValueRaw < stake || stake === 0n) {
      // In games with stakes, we can advance that the game is finished even
      // if Etherscan haven't indexed the transaction yet
      if (stake !== 0n) {
        dispatch(
          stageChanged({
            contractTransaction,
            stage: Stage.WAITING_RESULT,
          }),
        );
      }

      const resolvedResult = await checkGameEnd(contractTransaction);
      if (resolvedResult) {
        const { result, p1Weapon, nonce } = resolvedResult;

        notify(Events.GAME_END, contractTransaction);
        return dispatch(
          gameFinished({
            contractTransaction,
            result,
            p1Weapon,
            nonce,
          }),
        );
      }
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

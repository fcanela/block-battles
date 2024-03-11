import { useDispatch } from 'react-redux';
import { decodeDeployData, type Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getAccount, getPublicClient } from 'wagmi/actions';
import { Player } from '../constants/player';
import { abi, bytecode } from '../contracts/rps';
import { Events, notify } from '../libs/notify';
import { gameJoined } from '../store/gamesSlice';
import { useAppSelector } from './useAppSelector';
import { useUpdateGame } from './useUpdateGame';

/**
 * Provides a function that encapsulates the logic to join a game. It returns a function that,
 * when called, validates that the game exists and the user is part of it. On success, updates
 * the logic accordingly. On contract validation error, it marks the game as invalid.
 *
 * @returns {Function} Accepts the transaction hash that creates the contract joins it.
 *
 * @example
 * const joinGame = useJoinGame();
 *
 * <Button onClick={() => joinGame('0x...')}>Join the game</Button>
 */

export const useJoinGame = () => {
  const existingGames = useAppSelector(state => state.games);
  const dispatch = useDispatch();
  const config = useConfig();
  const update = useUpdateGame();

  return async (contractTransaction: Hash) => {
    if (existingGames[contractTransaction]) return existingGames[contractTransaction];

    const publicClient = getPublicClient(config);
    if (!publicClient) return notify(Events.GENERIC_ERROR, contractTransaction);

    const tx = await publicClient.getTransaction({
      hash: contractTransaction,
    });

    const p1 = tx.from as Hash;
    const stake = String(tx.value);

    let decoded;
    try {
      decoded = decodeDeployData({
        abi,
        bytecode: bytecode,
        data: tx.input,
      });
    } catch {
      return notify(Events.UNEXPECTED_CONTRACT_ERROR, contractTransaction);
    }

    if (decoded.args.length < 2) return notify(Events.UNEXPECTED_CONTRACT_ERROR, contractTransaction);

    const p2 = decoded.args[1] as Hash;

    const { address: myAddress } = getAccount(config);
    if (myAddress !== p1 && myAddress !== p2) return notify(Events.NOT_A_PLAYER_ERROR, contractTransaction);

    const player = myAddress === p1 ? Player.P1 : Player.P2;

    dispatch(
      gameJoined({
        player,
        p1,
        p2,
        stake,
        contractTransaction,
      }),
    );

    notify(Events.GAME_JOINED, contractTransaction);
    update(contractTransaction);
  };
};

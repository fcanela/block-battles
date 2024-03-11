import { useDispatch } from 'react-redux';
import type { Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import { Stage } from '../constants/stages';
import { Weapon } from '../constants/weapons';
import { abi } from '../contracts/rps';
import { Events, notify } from '../libs/notify';
import { stageChanged, p2WeaponChanged } from '../store/gamesSlice';
import { useAppSelector } from './useAppSelector';

/**
 * Provides a function to be used by Player 2 to use a weapon.
 *
 * @param {Hash} contractTransaction - The hash of the transaction that created the contract
 * @returns {Function} Uses the Weapon passed as parameter as Player 2 weapon.
 *
 * @example
 * const playAsP2 = usePlayAsP2('0x...');
 * return (
 *  <Button onClick={() => playAsP2(Weapon.SCISSORS)}>Play Scissors</Button>
 * )
 */
export const usePlayAsP2 = (contractTransaction: Hash) => {
  const game = useAppSelector(state => state.games[contractTransaction]);
  const dispatch = useDispatch();
  const config = useConfig();

  return async (weapon: Weapon) => {
    const { address: myAddress } = getAccount(config);
    if (myAddress !== game.p2) return notify(Events.UNAUTHORIZED_ACTION_ERROR, contractTransaction);
    if (game.stage !== Stage.STARTED) notify(Events.INCORRECT_TURN_ERROR, contractTransaction);

    const walletClient = await getWalletClient(config);

    await walletClient.writeContract({
      address: game.contractAddress as Hash,
      abi,
      functionName: 'play',
      args: [weapon],
      value: BigInt(game.stake),
    });

    dispatch(
      p2WeaponChanged({
        contractTransaction,
        weapon,
      }),
    );

    dispatch(
      stageChanged({
        contractTransaction,
        stage: Stage.P2_MOVED_SENT,
      }),
    );
  };
};

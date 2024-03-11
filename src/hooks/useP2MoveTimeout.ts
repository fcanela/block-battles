import { useDispatch } from 'react-redux';
import type { Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import { Stage } from '../constants/stages';
import { abi } from '../contracts/rps';
import { Events, notify } from '../libs/notify';
import { stageChanged } from '../store/gamesSlice';
import { useAppSelector } from './useAppSelector';

/**
 * Provides a function that can be called by Player 1 to claim the contract funds if the Player 2
 * takes to much to select a weapon.
 *
 * @param {Hash} contractTransaction - The hash of the transaction that created the contract
 * @returns {Function} Claims the contract funds because of Player 2 weapon select timeout.
 *
 * @example
 * const p2MoveTimeout = useP2MoveTimeout('0x...');
 * return (
 *  <Button onClick={p2MoveTimeout}>Claim the funds!</Button>
 * )
 */
export const useP2MoveTimeout = (contractTransaction: Hash) => {
  const dispatch = useDispatch();
  const game = useAppSelector(state => state.games[contractTransaction]);
  const config = useConfig();

  return async () => {
    const { address: myAddress } = getAccount(config);
    if (myAddress !== game.p1) return notify(Events.UNAUTHORIZED_ACTION_ERROR, contractTransaction);

    const wallet = await getWalletClient(config);
    await wallet.writeContract({
      address: game.contractAddress as Hash,
      abi,
      functionName: 'j2Timeout',
    });

    dispatch(
      stageChanged({
        contractTransaction,
        stage: Stage.TIMEOUT_CLAIM_SENT,
      }),
    );
  };
};

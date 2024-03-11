import { useDispatch } from 'react-redux';
import type { Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getAccount, getWalletClient } from 'wagmi/actions';
import { Stage } from '../constants/stages';
import { abi } from '../contracts/rps';
import { Events, notify } from '../libs/notify';
import { stageChanged } from '../store/gamesSlice';
import { useAppSelector } from './useAppSelector';

export const useRevealAsP1 = (contractTransaction: Hash) => {
  const game = useAppSelector(state => state.games[contractTransaction]);
  const dispatch = useDispatch();
  const config = useConfig();

  return async () => {
    const { address: myAddress } = getAccount(config);
    if (myAddress !== game.p1) return notify(Events.UNAUTHORIZED_ACTION_ERROR, contractTransaction);
    if (game.stage !== Stage.P2_MOVED) return notify(Events.INCORRECT_TURN_ERROR, contractTransaction);

    const walletClient = await getWalletClient(config);
    await walletClient.writeContract({
      address: game.contractAddress as Hash,
      abi,
      functionName: 'solve',
      args: [Number(game.p1Weapon), BigInt(game.nonce!)],
    });

    dispatch(
      stageChanged({
        contractTransaction,
        stage: Stage.P1_REVEALED_SENT,
      }),
    );
  };
};

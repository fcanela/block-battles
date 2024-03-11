import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

/**
 * Provides a wrapper function around any given action to ensure the user's wallet
 * is properly connected and on the right chain.
 * If the user is not connected or is on an incorrect chain, open the Rainbowkit to
 * ammend the situation.
 *
 * @returns {Function} A function that takes another function as argument, which will
 * be only executed if the wallet connection is correct.
 *
 * @example
 * const connectable = useConnectable();
 * const createGame = useCreateGame();
 *
 * return (<Button onClick={connectable(createGame}>Create a new game</Button>)
 */
export default function useConnectable() {
  const { isDisconnected, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  // I intentionally want to use the broad type
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (fn: Function) =>
    // I intentionally want to allow any kind of parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      // The user is not connected, request connection
      if (isDisconnected) return openConnectModal!();
      // The user is connected to the wrong chain, ask to change it
      if (!chain) return openChainModal!();

      // If everything is alright, proceed
      fn(...args);
    };
}

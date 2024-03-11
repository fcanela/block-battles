import { getAddress, type Hash } from 'viem';
import { useConfig } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import { Events, notify } from '../libs/notify';
import { checkCorrectContract } from '../libs/security';

/**
 * Provides a function that, given a transaction, ensures that the created contract
 * is the expected one.
 *
 * @returns {Function} Given a transaction hash, validates the contract
 *
 * @example
 * const validateContract = useValidateContract();
 * const { contractAddress, isValid } = validateContract('0x...');
 * console.log(`Is ${contractAddress} valid? ${isValid}`);
 */

export default function useValidateContract() {
  const config = useConfig();

  return async (contractTransaction: Hash) => {
    const publicClient = getPublicClient(config);
    if (!publicClient) return notify(Events.GENERIC_ERROR, contractTransaction);
    let receipt;

    try {
      receipt = await publicClient.getTransactionReceipt({
        hash: contractTransaction,
      });
    } catch {
      // Until the transaction is mined, skip this game
      return;
    }

    const contractAddress = getAddress(receipt.contractAddress as Hash);
    const isValid = await checkCorrectContract(contractAddress);

    return { contractAddress, isValid };
  };
}

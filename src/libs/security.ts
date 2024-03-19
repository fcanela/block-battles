import { type Hash } from 'viem';
import { getBytecode } from 'wagmi/actions';
import { config } from '../providers/WagmiProvider';
import { deployedBytecode as expectedBytecode } from '../contracts/rps';

/**
 * Checks if a deployed contract is the expected game or a modified/malformed/unexpected one
 * using the bytecode.
 *
 * @param {Hash} contractAddress - The address of the deployed contract
 *
 * @returns {boolean} Indicates if the contract is valid
 */
export const checkCorrectContract = async (contractAddress: Hash) => {
  let foundBytecode;
  try {
    foundBytecode = await getBytecode(config, {
      address: contractAddress,
    });
    return foundBytecode === expectedBytecode;
  } catch (err) {
    return false;
  }
};

/**
 * Generates a cryptographically strong random numbers
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
export function generateRandomNonce() {
  const array = new Uint32Array(1);
  self.crypto.getRandomValues(array);
  const [nonce] = array;
  return nonce;
}

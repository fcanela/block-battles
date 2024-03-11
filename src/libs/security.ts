import { sha256, type Hash } from 'viem';
import { getBytecode } from 'wagmi/actions';
import { config } from '../providers/WagmiProvider';
import { deployedBytecode as expectedBytecode, sourceCodeHash as expectedSourceHash } from '../contracts/rps';
import { getVerifiedContractSource } from './etherscan';

/**
 * Checks if a deployed contract is the expected game or a modified/malformed/unexpected one.
 *
 * @param {Hash} contractAddress - The address of the deployed contract
 *
 * @returns {boolean} Indicates if the contract is valid
 */
export const checkCorrectContract = async (contractAddress: Hash) => {
  // Check the bytecode first, but this can fail after a while as nodes only keep the bytecode
  // in memory for a few blocks
  const isBytecodeCorrect = await checkBytecode(contractAddress);
  if (isBytecodeCorrect) return true;

  // We check the validated contract source code in etherscan, but somehow Etherscan matches a
  // wrong contract if called immediatelly, so we use it only as fallback if the bytecode check
  // fails
  const isSourceCodeCorrect = await checkEtherscanVerifiedSourceCode(contractAddress);
  return isSourceCodeCorrect;
};

/**
 * Validates the contract using Etherscan. As the contract has been verified, this function retrieves
 * the validated source code and compares it with the local one.
 */
const checkEtherscanVerifiedSourceCode = async (contractAddress: Hash) => {
  const source = await getVerifiedContractSource(contractAddress);
  const deployedContractSourceCodeHash = sha256(source);
  return expectedSourceHash === deployedContractSourceCodeHash;
};

/**
 * Validates the contract comparing the deployed bytecode
 */
const checkBytecode = async (contractAddress: Hash) => {
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

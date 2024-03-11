import type { Hash, Hex } from 'viem';

const BASE_API_URL = 'https://api-sepolia.etherscan.io/api';
const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const getVerifiedContractSource = async (contractAddress: Hash) => {
  const url = `${BASE_API_URL}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${API_KEY}`;
  const response = await fetch(url).then(r => r.json());
  if (response.message !== 'OK') throw new Error('Something went wrong');
  return response.result[0].SourceCode;
};

export type RawTransaction = {
  blockNumber: bigint;
  hash: Hash;
  from: Hash;
  to: Hash;
  value: string;
  input: Hex;
  methodId: Hex;
  isError: string;
};

/**
 * Returns the address internal transactions.
 *
 * Used to figure out who is the winner of a game.
 */
export const getInternalTransactions = async (
  contractAddress: Hash,
  endBlock: bigint = 99999999999n,
): Promise<RawTransaction[] | null> => {
  const url = `${BASE_API_URL}?module=account&action=txlistinternal&address=${contractAddress}&startblock=0&endblock=${endBlock.toString()}&sort=asc&apikey=${API_KEY}`;

  let response;

  try {
    response = await fetch(url).then(r => r.json());
  } catch {
    return null;
  }
  if (response.message !== 'OK') return null;

  const internalTxs: RawTransaction[] = response.result.filter((tx: RawTransaction) => tx.isError === '0');
  return internalTxs;
};

/**
 * Return the address transactions.
 *
 * Used to obtain the `solve` transaction from P1 and figure out the weapon and nonce.
 */
export const getNormalTransactions = async (
  address: Hash,
  startBlock: bigint = 0n,
  endBlock: bigint = 99999999999n,
): Promise<RawTransaction[] | null> => {
  const url = `${BASE_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock.toString()}&endblock=${endBlock.toString()}&sort=asc&apikey=${API_KEY}`;

  let response;
  try {
    response = await fetch(url).then(r => r.json());
  } catch (error) {
    return null;
  }
  if (response.message !== 'OK') return null;

  const internalTxs: RawTransaction[] = response.result.filter((tx: RawTransaction) => tx.isError === '0');
  return internalTxs;
};

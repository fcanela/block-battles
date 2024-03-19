import type { Hash, Hex } from 'viem';

const BASE_API_URL = 'https://api-sepolia.etherscan.io/api';
const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export type RawTransaction = {
  blockNumber: bigint;
  hash: Hash;
  from: Hash;
  to: Hash;
  value: string;
  input: Hex;
  methodId: Hex;
  isError: string;
  timeStamp: string;
};

/**
 * Return the address transactions.
 *
 * Used to obtain the game ending transaction to figure out the result.
 */
export const getNormalTransactions = async (
  address: Hash,
  startBlock: string = '0',
): Promise<RawTransaction[] | null> => {
  const url = `${BASE_API_URL}?module=account&action=txlist&address=${address}&startblock=${startBlock.toString()}&sort=asc&apikey=${API_KEY}`;

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

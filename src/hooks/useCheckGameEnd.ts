import { abi } from '../contracts/rps.ts';
import { type Hash, getAddress, decodeFunctionData, toFunctionSelector } from 'viem';
import { getNormalTransactions } from '../libs/etherscan.ts';
import { useAppSelector } from './useAppSelector.ts';
import { GameResult } from '../constants/game_result.ts';
import { Weapon } from '../constants/weapons.ts';

const getSelector = (name: 'solve' | 'j1Timeout' | 'j2Timeout') => {
  const fnAbi = abi.find(fn => fn.type === 'function' && fn.name === name);
  if (!fnAbi) throw new Error(`Unable to find selector for ${name}`);

  // @ts-expect-error: TS is not narrowing the type with precission here. All
  // the selectable functions have the right abi structure
  return toFunctionSelector(fnAbi);
};

const endingFnSelectorsMap = {
  SOLVE: getSelector('solve'),
  P1_TIMEOUT: getSelector('j1Timeout'),
  P2_TIMEOUT: getSelector('j2Timeout'),
};
const endingFnSelectors = Object.values(endingFnSelectorsMap);

const getWinner = (w1: Weapon, w2: Weapon): GameResult => {
  if (w1 === w2) return GameResult.DRAW;
  if (w1 === Weapon.NULL) return GameResult.P2_WINS;

  if (w1 % 2 === w2 % 2) {
    return w1 < w2 ? GameResult.P1_WINS : GameResult.P2_WINS;
  }

  return w1 > w2 ? GameResult.P1_WINS : GameResult.P2_WINS;
};

type ResolvedGame = {
  result: GameResult;
  p1Weapon?: Weapon;
  nonce?: string;
};

/**
 * Provides a function that indicates the result of a finished game.
 *
 * As the contract emits no events, it uses Etherscan API to retrieve both players
 * transactions and looks for the first successful `solve` or timeout call.
 *
 * @returns {Function} Indicates the result of a finished game.
 *
 * @example
 * const checkGameEnd = useCheckGameEnd();
 * const gameEnd = checkGameEnd('0x...');
 * console.log(
 *   gameEnd
 *     ? `Game finished with result ${gameEnd.result} (${gameEnd.p1Weapon})`
 *     : 'Still ongoing'
 * );
 */
export default function useCheckGameEnd() {
  const games = useAppSelector(state => state.games);

  return async (contractTransaction: Hash): Promise<ResolvedGame | null> => {
    const game = games[contractTransaction];
    if (!game) return null;

    const [p1Txs, p2Txs] = await Promise.all([
      getNormalTransactions(game.p1, game.startingBlock),
      getNormalTransactions(game.p2, game.startingBlock),
    ]);

    const lastTx = [...(p1Txs || []), ...(p2Txs || [])]
      // Sort in ascendent order
      .sort((tx1, tx2) => tx1.timeStamp.localeCompare(tx2.timeStamp))
      // Only the first valid one finishes the game
      .find(tx => {
        if (!tx.to || getAddress(tx.to) !== game.contractAddress) return false;
        if (tx.isError !== '0') return false;
        if (!endingFnSelectors.includes(tx.methodId)) return false;
        return true;
      });

    // If no solve or timeout call found, the game is still on-going
    if (!lastTx) return null;

    const from = getAddress(lastTx.from);

    // For timeouts, only the result is returned
    if (lastTx.methodId !== endingFnSelectorsMap.SOLVE) {
      return {
        // and the winner is whoever called the timeout
        result: from === getAddress(game.p1) ? GameResult.P1_WINS : GameResult.P2_WINS,
      };
    }

    // For solved games, decode the weapon and nonce
    const { args: decoded } = decodeFunctionData({
      abi,
      data: lastTx.input,
    });

    // The weapons enum has the same indexing as the solidity contract
    const p1Weapon = decoded[0] as Weapon;
    const nonce = (decoded[1] as bigint).toString();
    const result = getWinner(p1Weapon, game.p2Weapon!);

    return {
      result,
      p1Weapon,
      nonce,
    };
  };
}

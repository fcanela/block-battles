import { decodeFunctionData, getAddress } from 'viem';
import { Weapon } from '../constants/weapons';
import { abi } from '../contracts/rps';
import { getNormalTransactions } from '../libs/etherscan';
import { GameState } from '../store/gamesSlice';

const solveMethodId = '0xa5ddec7c';

type P1Solve = {
  p1Weapon: Weapon;
  nonce: string;
};

/**
 * As Player 1 weapon selection uses a commit-reveal pattern, which the final weapon choice not being
 * stored in the contract nor announced with an event, it makes not obvious for Player 1 what the opponent
 * weapon was.
 *
 * This method uses Etherscan API to fetch the most recent Player 1 transactions, finds one that calls the
 * `solve` function and decodes the weapon and nonce.
 *
 * @returns {Function} Passing the GameState as argument, returns the Player 1 picked weapon and nonce.
 *
 * @example
 * const readP1SolveInputs = useReadP1SolveInput();
 * const { p1Weapon, nonce } = readP1SolveInputs(gameState);
 * console.log('Player 1 picked', p1Weapon, 'and nonce', nonce)
 */

export default function useReadP1SolveInput() {
  return async (game: GameState): Promise<P1Solve | null> => {
    const p1Txs = await getNormalTransactions(game.p1);
    if (!p1Txs) return null;

    const solveTransaction = p1Txs.find(
      tx => tx.methodId === solveMethodId && getAddress(tx.to) === game.contractAddress,
    );
    if (!solveTransaction) return null;

    const { args: decoded } = decodeFunctionData({
      abi,
      data: solveTransaction.input,
    });

    return {
      p1Weapon: decoded[0] as Weapon,
      nonce: (decoded[1] as bigint).toString(),
    };
  };
}

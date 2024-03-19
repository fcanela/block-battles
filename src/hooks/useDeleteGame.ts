import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { Hash } from 'viem';
import { Stage } from '../constants/stages';
import { gameDeleted } from '../store/gamesSlice';
import { useAppSelector } from './useAppSelector';
import { Events, notify } from '../libs/notify';

/**
 * Provides a function that allows the deletion of games. It warns when the game is still ongoing.
 *
 * @param {Hash} contractTransaction - The hash of the transaction that deployed the contract, which is use as
 * identifier.
 * @returns {Function} When called, deletes the game
 *
 * @example
 * const deleteGame = useDeleteGame('0x...');
 *
 * return (<Button onClick={deleteGame}>Delete the game</Buttoh>)
 */
export const useDeleteGame = (contractTransaction: Hash) => {
  const game = useAppSelector(state => state.games[contractTransaction]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
    if (game.stage !== Stage.FINISHED) {
      const isConfirmed = confirm(
        'Deleting an ongoing game could result in you losing your stakes. Are you sure do you want to continue?',
      );
      if (!isConfirmed) return;
    }

    dispatch(gameDeleted({ contractTransaction }));
    notify(Events.GAME_DELETED, contractTransaction);
    navigate('/games');
  };
};

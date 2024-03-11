import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { autoUpdateIntervalInSeconds } from '../constants/auto_update';
import { Stage } from '../constants/stages';
import { useAppSelector } from '../hooks/useAppSelector';
import { useUpdateGame } from '../hooks/useUpdateGame';
import { GameState } from '../store/gamesSlice';

/**
 * This is a non-presentational component. Its duty is to periodically fetch
 * and update the status of the games
 */
export default function GamesUpdater() {
  const { isConnected } = useAccount();
  const games = useAppSelector(state => state.games);
  const update = useUpdateGame();

  useEffect(() => {
    const interval = setInterval(() => {
      Object.values(games)
        .filter((game: GameState) => game.stage !== Stage.FINISHED)
        .forEach(game => update(game.contractTransaction));
    }, autoUpdateIntervalInSeconds * 1_000);

    return () => clearInterval(interval);
  }, [isConnected, games, update]);

  return null;
}

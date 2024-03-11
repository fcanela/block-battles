import { Link } from 'react-router-dom';
import EmptyGamesList from '../components/EmptyGamesList';
import GameCard from '../components/GameCard';
import { useAppSelector } from '../hooks/useAppSelector';

export default function GamesPage() {
  const games = useAppSelector(state => state.games);

  if (Object.keys(games).length === 0) return <EmptyGamesList />;

  return (
    <article className="flex flex-col gap-y-4 w-full items-center">
      {Object.values(games)
        .sort((g1, g2) => Number(g1.joinedAt <= g2.joinedAt))
        .map(game => (
          <Link
            to={`/games/${game.contractTransaction}`}
            key={game.contractTransaction}
            className="max-w-screen-lg w-full"
          >
            <GameCard game={game} variant="small" />
          </Link>
        ))}
    </article>
  );
}

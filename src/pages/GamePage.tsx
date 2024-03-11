import { useNavigate, useParams } from 'react-router-dom';
import type { Hash } from 'viem';
import Button from '../components/Button';
import GameCard from '../components/GameCard';
import Actions from '../components/actions/Actions';
import { useAppSelector } from '../hooks/useAppSelector';

export default function GamePage() {
  const { contractTransaction } = useParams();
  const game = useAppSelector(state => (contractTransaction ? state.games[contractTransaction as Hash] : null));
  const navigate = useNavigate();

  if (!game)
    return (
      <article className="flex w-full items-center flex-col">
        <p className="text-xl">This game is not tracked in your account</p>
        <p>We can take you back to your list of games or, if you a player on this game, you can join it</p>
        <div className="flex space-evenly">
          <Button variant="primary" onClick={() => navigate(`/games`)}>
            Show my games
          </Button>
          <Button onClick={() => navigate(`/join/${contractTransaction}`)}>Join</Button>
        </div>
      </article>
    );

  return (
    <article className="flex flex-col w-full justify-between items-center">
      <div className="w-full">
        <Actions game={game} />
      </div>
      <GameCard game={game} />
    </article>
  );
}

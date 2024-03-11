import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function EmptyGamesList() {
  const navigate = useNavigate();

  return (
    <article className="flex w-full h-full items-center justify-center space-x-8 py-12">
      <img src="/duel.svg" className="text-indigo-700 w-1/3" />
      <div className="flex flex-col items-center space-y-4">
        <div className="text-4xl">This is incredibly empty!</div>
        <div>Let's fix it! Create a a new game and invite a friend or join a game already created by a friend.</div>
        <div className="flex">
          <Button variant="primary" className="animate-pulse" onClick={() => navigate('/create')}>
            Create a new game
          </Button>
          <Button onClick={() => navigate('/join')}>Join an existing game</Button>
        </div>
      </div>
    </article>
  );
}

import clsx from 'clsx';
import { Player } from '../constants/player';
import { Stage } from '../constants/stages';
import { GameState } from '../store/gamesSlice';
import ClipboardButton from './ClipboardButton';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Props = {
  game: GameState;
};

const applicableStages = [Stage.CONTRACT_SENT, Stage.STARTED];

export default function ShareGame({ game }: Props) {
  const isNextAction = game.player === Player.P1 && applicableStages.includes(game.stage);

  const link = `${BASE_URL}/join/${game.contractTransaction}`;

  return (
    <section
      className={clsx(
        'flex flex-col items-center justify-around w-full border-indigo-200 border p-4',
        isNextAction && 'animate-pulse',
        !isNextAction && 'text-gray-500',
      )}
    >
      <div className="flex flex-row gap-3 items-baseline">
        <span className="font-bold">ID: </span>
        <span className="font-mono">
          {game.contractTransaction}
          <ClipboardButton value={game.contractTransaction} />
        </span>
      </div>
      <div className="flex flex-row gap-3 items-baseline">
        <span className="font-bold">Link: </span>
        <div className="font-mono">
          {link}
          <ClipboardButton value={link} />
        </div>
      </div>
    </section>
  );
}

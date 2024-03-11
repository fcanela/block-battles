import { addSeconds, formatDistanceToNow, formatDistanceToNowStrict, isPast } from 'date-fns';
import { useEffect, useState } from 'react';
import { autoUpdateIntervalInSeconds } from '../../constants/auto_update';
import { Stage } from '../../constants/stages';
import { useUpdateGame } from '../../hooks/useUpdateGame';
import { GameState } from '../../store/gamesSlice';
import Button from '../Button';
import ActionCard from './ActionCard';

type Props = {
  game: GameState;
};

const getNextUpdateText = (game: GameState) => {
  if (game.stage === Stage.FINISHED) return 'never';
  if (!game.updatedAt) return 'queued';

  const nextUpdateAt = addSeconds(game.updatedAt, autoUpdateIntervalInSeconds);
  if (isPast(nextUpdateAt)) return 'queued';

  return `in ${formatDistanceToNowStrict(nextUpdateAt)}`;
};

export default function RefreshAction({ game }: Props) {
  const [, setNow] = useState(new Date());
  const update = useUpdateGame();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [game.stage]);

  return (
    <ActionCard size="sm" className="flex flex-col items-center">
      <Button onClick={() => update(game.contractTransaction)}>Refresh game state</Button>
      <div className="flex flex-col text-xs w-full items-center">
        <div className="flex flex-row justify-between gap-x-2">
          <div className="text-left">Last update:</div>
          <div className="text-left">{game.updatedAt ? ` ${formatDistanceToNow(game.updatedAt)} ago` : ` Never`}</div>
        </div>
        <div className="flex flex-row jusitfy-between gap-x-2">
          <div className="text-left">Next automatic update:</div>
          <div className="text-left">{getNextUpdateText(game)}</div>
        </div>
      </div>
    </ActionCard>
  );
}

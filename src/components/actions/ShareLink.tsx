import { Player } from '../../constants/player';
import { Stage } from '../../constants/stages';
import { GameState } from '../../store/gamesSlice';
import ClipboardButton from '../ClipboardButton';
import ActionCard from './ActionCard';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Props = {
  game: GameState;
};

const applicableStages = [Stage.CONTRACT_SENT, Stage.STARTED];

export default function RefreshAction({ game }: Props) {
  const isApplicable = game.player === Player.P1 && applicableStages.includes(game.stage);

  if (!isApplicable) return null;

  const link = `${BASE_URL}/join/${game.contractTransaction}`;

  return (
    <ActionCard className="flex flex-col items-center justify-around" size="lg">
      <div>Share this link with Player 2:</div>
      <div className="flex flex-row">
        <div className="font-mono text-xs">{link}</div>
        <ClipboardButton value={link} />
      </div>
    </ActionCard>
  );
}

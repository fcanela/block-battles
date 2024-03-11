import { Player } from '../../constants/player';
import { Stage } from '../../constants/stages';
import useConnectable from '../../hooks/useConnectable';
import { useRevealAsP1 } from '../../hooks/useRevealAsP1';
import { GameState } from '../../store/gamesSlice';
import Button from '../Button';
import ActionCard from './ActionCard';

type Props = {
  game: GameState;
};

export default function RevealAction({ game }: Props) {
  const revealAsP1 = useRevealAsP1(game.contractTransaction);
  const connectable = useConnectable();

  const isApplicable = game.player === Player.P1 && game.stage === Stage.P2_MOVED;

  if (!isApplicable) return null;

  return (
    <ActionCard size="sm" className="flex flex-col justify-center items-center">
      <Button className="animate-pulse" variant="primary" onClick={connectable(revealAsP1)}>
        Reveal
      </Button>
      <div className="text-xs">Reveals your weapon and finishes the game</div>
    </ActionCard>
  );
}

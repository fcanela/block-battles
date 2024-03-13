import { Player } from '../../constants/player';
import useConnectable from '../../hooks/useConnectable';
import { useP1RevealTimeout } from '../../hooks/useP1RevealTimeout';
import { useP2MoveTimeout } from '../../hooks/useP2MoveTimeout';
import { getGameTimeoutState } from '../../libs/time';
import { GameState } from '../../store/gamesSlice';
import Button from '../Button';
import ActionCard from '../ActionCard';

type Props = {
  game: GameState;
};

export default function ClaimTimeoutAction({ game }: Props) {
  const connectable = useConnectable();
  const p1Timeout = useP1RevealTimeout(game.contractTransaction);
  const p2Timeout = useP2MoveTimeout(game.contractTransaction);

  const timeoutState = getGameTimeoutState(game);

  if (!timeoutState.isLate) return null;
  if (game.turnOf === game.player) return null;

  const timeoutFn = game.player === Player.P1 ? p2Timeout : p1Timeout;

  return (
    <ActionCard size="sm" className="flex flex-col items-center justify-center">
      <Button variant="primary" className="animate-pulse" onClick={connectable(timeoutFn)}>
        Claim!
      </Button>
      <div className="text-xs">Your opponent took to much to react. You can claim all the stakes!</div>
    </ActionCard>
  );
}

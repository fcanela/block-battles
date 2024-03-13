import { GameState } from '../../store/gamesSlice';
import RefreshAction from './RefreshAction';
import RevealAction from './RevealAction';
import MoveAsP2Action from './MoveAsP2Action';
import ClaimTimeoutAction from './ClaimTimeoutAction';
import DeleteGameAction from './DeleteGameAction';

type Props = {
  game: GameState;
};
export default function Actions({ game }: Props) {
  if (!game) return null;

  return (
    <div className="flex flex-row w-full gap-10 justify-between">
      <RefreshAction game={game} />
      <ClaimTimeoutAction game={game} />
      <RevealAction game={game} />
      <MoveAsP2Action game={game} />
      <DeleteGameAction game={game} />
    </div>
  );
}

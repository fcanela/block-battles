import useConnectable from '../../hooks/useConnectable';
import { useDeleteGame } from '../../hooks/useDeleteGame';
import { GameState } from '../../store/gamesSlice';
import Button from '../Button';
import ActionCard from './ActionCard';

type Props = {
  game: GameState;
};

export default function DeleteGameAction({ game }: Props) {
  const deleteGame = useDeleteGame(game.contractTransaction);
  const connectable = useConnectable();

  return (
    <ActionCard size="sm" className="flex flex-col justify-center items-center">
      <Button className="animate-pulse" onClick={connectable(deleteGame)}>
        Delete
      </Button>
      <div className="text-xs">Removes this game from the list</div>
    </ActionCard>
  );
}

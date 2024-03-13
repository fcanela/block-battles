import clsx from 'clsx';
import { useState } from 'react';
import { Player } from '../../constants/player';
import { Stage } from '../../constants/stages';
import { Weapon } from '../../constants/weapons';
import { usePlayAsP2 } from '../../hooks/usePlayAsP2';
import { GameState } from '../../store/gamesSlice';
import Button from '../Button';
import SelectWeapon from '../SelectWeapon';
import ActionCard from '../ActionCard';
import useConnectable from '../../hooks/useConnectable';

type Props = {
  game: GameState;
};

export default function MoveAsP2Action({ game }: Props) {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const playAsP2 = usePlayAsP2(game!.contractTransaction);
  const connectable = useConnectable();

  const isApplicable = game.player === Player.P2 && game.stage === Stage.STARTED;

  if (!isApplicable) return null;

  const connectablePlayAsP2 = connectable(playAsP2);

  return (
    <ActionCard className="flex flex-row items-center justify-between">
      <div className={clsx('w-3/4', !weapon && 'animate-pulse')}>
        <SelectWeapon value={weapon} onChange={setWeapon} />
      </div>
      <div className={clsx('w-1/4 flex justify-center', weapon && 'animate-pulse')}>
        <Button variant="primary" onClick={() => connectablePlayAsP2(weapon as Weapon)} disabled={weapon === null}>
          Move
        </Button>
      </div>
    </ActionCard>
  );
}

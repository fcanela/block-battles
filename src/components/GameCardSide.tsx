import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { TimeoutState, getGameTimeoutState } from '../libs/time';
import { GameState } from '../store/gamesSlice';
import EtherscanLink from './EtherscanLink';
import { Player } from '../constants/player';
import { unknownWeapon, weaponDetails } from '../constants/weapons';

type Props = {
  game: GameState;
  side: Player;
  variant: 'small' | 'full';
};

const getPlayerWeaponDetails = (side: Player, game: GameState) => {
  const weapon = side === Player.P1 ? game.p1Weapon : game.p2Weapon;
  return weapon ? weaponDetails[weapon] : unknownWeapon;
};

export default function GameCardSide({ game, side, variant }: Props) {
  const address = side === Player.P1 ? game.p1 : game.p2;

  const weapon = getPlayerWeaponDetails(side, game);

  const isPlayerTurn = game.turnOf === side;

  const [timeoutState, setTimeoutState] = useState<TimeoutState>(getGameTimeoutState(game));
  useEffect(() => {
    if (!isPlayerTurn) return;
    const interval = setInterval(() => {
      setTimeoutState(getGameTimeoutState(game));
    }, 1_000);

    return () => clearInterval(interval);
  }, [game.stage, isPlayerTurn, game]);

  const isFull = variant === 'full';
  return (
    <div className={clsx('h-full w-full flex flex-col items-center justify-between', isPlayerTurn && 'animate-pulse')}>
      <div className="flex flex-col items-center w-full">
        {isFull && (
          <div className="text-xs flex flex-row justify-center gap-4 w-full">
            <div>PLAYER {side === Player.P1 ? '1' : '2'}:</div>
            <EtherscanLink value={address} />
          </div>
        )}
        <div className={clsx('text-bold text-5xl', isFull ? 'text-5xl' : 'text-xl')}>
          {game.player === side ? 'You' : 'Opponent'}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-6xl">
          <weapon.icon />
        </div>
        {isFull && weapon.text}
      </div>
      <div>
        {isFull && isPlayerTurn && (
          <span>
            Turns {timeoutState.isLate ? 'expired' : 'expires'} {timeoutState.distance}
          </span>
        )}
      </div>
      <div className="">
        {isFull && side === Player.P1 && game.nonce && (
          <span>
            Nonce: <span className="font-mono">{game.nonce}</span>
          </span>
        )}
      </div>
    </div>
  );
}

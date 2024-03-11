import clsx from 'clsx';
import { formatEther } from 'viem';
import { useChainId, useChains } from 'wagmi';
import { gameResultTexts } from '../constants/game_result';
import { Player } from '../constants/player';
import { Stage, stageTexts } from '../constants/stages';
import { GameState } from '../store/gamesSlice';
import EtherscanLink from './EtherscanLink';
import GameCardSide from './GameCardSide';

type Props = {
  game: GameState;
  variant?: 'small' | 'full';
};

export default function GameCard({ game, variant = 'full' }: Props) {
  const chainId = useChainId();
  const chains = useChains();
  const [stageTag, stageDescription] = stageTexts[game.stage] || [];
  const resultTag = game.stage === Stage.FINISHED && gameResultTexts[game.result!];

  const chain = chains.find(chain => chain.id === chainId);

  const isFull = variant === 'full';

  return (
    <div
      className={clsx(
        'flex flex-no-wrap items-center justify-between w-full bg-gray-800 text-white shadow',
        !isFull && 'my-1 px-2 py-6',
        isFull && 'my-4 px-4 py-10',
      )}
    >
      <div className={clsx(!isFull && 'w-1/4 h-32', isFull && 'w-1/4 h-64')}>
        <GameCardSide game={game} side={Player.P1} variant={variant} />
      </div>
      <div className={clsx('flex flex-col w-2/4', !isFull && 'h-32 justify-around', isFull && 'h-64 items-center')}>
        <div className="flex flex-col w-full items-center h-1/3">
          {isFull && <div className="text-xs">{stageDescription}</div>}
          <div className={clsx('text-bold uppercase', isFull ? 'text-5xl' : 'text-3xl')}>
            {stageTag}
            {game.stage === Stage.FINISHED && `: ${resultTag}`}
          </div>
        </div>
        <div className="h-1/3 flex flex-col items-center w-full">
          <div className="text-4xl">
            {formatEther(BigInt(game.stake))} {chain?.nativeCurrency.symbol}
          </div>
          {isFull && <div className="text-xs">{chain?.nativeCurrency.name}</div>}
        </div>
        {isFull && (
          <div className="flex h-1/3 justify-around items-end w-full">
            <div>
              Contract transaction: <EtherscanLink type="tx" value={game.contractTransaction} />
            </div>
            <div>
              Address: <EtherscanLink type="address" value={game.contractAddress} />
            </div>
          </div>
        )}
      </div>
      <div className={clsx(!isFull && 'w-1/4 h-32', isFull && 'w-1/4 h-64')}>
        <GameCardSide game={game} side={Player.P2} variant={variant} />
      </div>
    </div>
  );
}

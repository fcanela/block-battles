import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function HomePage() {
  return (
    <article className="flex flex-row w-full">
      <aside className="w-1/3 text-9xl justify-center items-center flex text-indigo-700 pb-4">
        <img src="/weapons.svg" />
      </aside>
      <div className="w-2/3 flex flex-col justify-around items-center">
        <div className="text-3xl text-center">On-chain bets with Rock, Paper, Scissors, Lizard, Spock game!</div>
        <div className="text-7xl font-mono">Block Battles</div>
        <div className="animate-pulse flex justify-center">
          <ConnectButton />
        </div>
      </div>
    </article>
  );
}

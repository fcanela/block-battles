import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  FaPlus as CreateGameIcon,
  FaQuestion as FAQIcon,
  FaBars as GamesListIcon,
  FaRightToBracket as JoinGameIcon,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import NavBarMenuEntry from './NavBarMenuEntry';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-700 shadow text-white">
      <div className="container px-6 h-16 flex justify-between items-center mx-auto">
        <div className="flex items-center h-full">
          <Link to="/" className="mr-10 flex items-center">
            <img src="/favicon.svg" className="h-8" alt="Logo. A fist symbolizing rock." />
            <h3 className="text-base text-white font-bold tracking-normal leading-tight ml-3">BlockBattles</h3>
          </Link>
          <ul className="flex items-center h-full">
            <NavBarMenuEntry to="/games" icon={<GamesListIcon />}>
              Games
            </NavBarMenuEntry>
            <NavBarMenuEntry to="/create" icon={<CreateGameIcon />}>
              Create
            </NavBarMenuEntry>
            <NavBarMenuEntry to="/join" icon={<JoinGameIcon />}>
              Join
            </NavBarMenuEntry>
            <NavBarMenuEntry to="/faq" icon={<FAQIcon />}>
              FAQ
            </NavBarMenuEntry>
          </ul>
        </div>
        <div className="h-full flex items-center justify-end">
          <ConnectButton />
        </div>
      </div>
      <hr />
    </nav>
  );
}

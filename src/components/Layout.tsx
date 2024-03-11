import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import GamesUpdater from './GamesUpdater';
import Navbar from './Navbar';

/**
 * Elements that are common for all the pages
 */
export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col">
      <Navbar />
      <div className="w-full flex-1 flex items-center justify-center py-10">
        <div className="container flex items-center justify-center h-full">
          <Outlet />
          <GamesUpdater />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

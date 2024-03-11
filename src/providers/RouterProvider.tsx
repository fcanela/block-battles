import { RouterProvider as BaseRouterProvider, Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import CreateGamePage from '../pages/CreateGamePage';
import FAQPage from '../pages/FaqPage';
import GamePage from '../pages/GamePage';
import GamesPage from '../pages/GamesPage';
import JoinGamePage from '../pages/JoinGamePage';

/**
 * Redirects to the root page if the user tries to access a protected URL.
 *
 * Ideally, for better UX, it should redirect to a login page that have the
 * restricted path as query parameter and returns to it on login.
 */
const ProtectedRoute = () => {
  const { isConnected } = useAccount();
  if (!isConnected) return <Navigate to="/" />;
  return <Outlet />;
};

export const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/faq',
        element: <FAQPage />,
      },
      {
        path: '/games',
        element: <GamesPage />,
      },
      {
        path: '/create',
        element: <CreateGamePage />,
      },
      {
        path: '/join/:contractTransaction?',
        element: <JoinGamePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/games/:contractTransaction',
            element: <GamePage />,
          },
        ],
      },
    ],
  },
]);

export function RouterProvider() {
  return <BaseRouterProvider router={routes} />;
}

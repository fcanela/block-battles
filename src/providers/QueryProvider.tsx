import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const client = new QueryClient();

/**
 * Provider for TanStack React Query, which helps performing async operations and
 * is required by Wagmi
 */
export function QueryProvider({ children }: Props) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

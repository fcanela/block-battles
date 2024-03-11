import AccountStoreProvider from './AccountStoreProvider';
import { QueryProvider } from './QueryProvider';
import { RainbowKitProvider } from './RainbowKitProvider';
import { RouterProvider } from './RouterProvider';
import { WagmiProvider } from './WagmiProvider';

/**
 * Contains all the application providers for easier management and structure
 */
export default function Providers() {
  return (
    <WagmiProvider>
      <QueryProvider>
        <RainbowKitProvider>
          <AccountStoreProvider>
            <RouterProvider />
          </AccountStoreProvider>
        </RainbowKitProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}

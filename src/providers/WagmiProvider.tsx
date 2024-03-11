import { WagmiProvider as BaseWagmiProvider, fallback, http, unstable_connector } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { injected } from 'wagmi/connectors';
import type { HttpTransport } from 'viem';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const providers = [
  {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    url: 'https://eth-sepolia.g.alchemy.com/v2/',
  },
  {
    apiKey: import.meta.env.VITE_INFURA_API_KEY,
    url: 'https://arbitrum-sepolia.infura.io/v3/',
  },
  {
    apiKey: import.meta.env.VITE_ANKR_API_KEY,
    url: 'https://rpc.ankr.com/eth_sepolia/',
  },
];

// Creates an array of transports for those API keys that are configured
const transports = providers.reduce((acc, provider) => {
  const { apiKey, url } = provider;
  if (!apiKey) return acc;
  acc.push(http(`${url}${apiKey}`));
  return acc;
}, [] as HttpTransport[]);

export const config = getDefaultConfig({
  appName: 'BlockBattles',
  projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([unstable_connector(injected), ...transports]),
  },
});

type Props = {
  children: React.ReactNode;
};

export function WagmiProvider({ children }: Props) {
  return <BaseWagmiProvider config={config}>{children}</BaseWagmiProvider>;
}

import { RainbowKitProvider as BaseRainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

type Props = {
  children: React.ReactNode;
};

const rainbowKitTheme = lightTheme({
  borderRadius: 'none',
  accentColor: '#4c51bf',
});

/**
 * Provider for RainbowKit, the UI library used for wallet integration
 */
export function RainbowKitProvider({ children }: Props) {
  return <BaseRainbowKitProvider theme={rainbowKitTheme}>{children}</BaseRainbowKitProvider>;
}

import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http('https://mainnet.base.org', { batch: true }),
    [baseSepolia.id]: http('https://sepolia.base.org', { batch: true }),
  },
  pollingInterval: 200, // Denim 200ms native canonical blocks on Base Mainnet
})



import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org', { batch: true }),
    [baseSepolia.id]: http('https://sepolia.base.org', { batch: true }),
  },
  pollingInterval: 200, // Denim 200ms native canonical blocks on Base Mainnet
})



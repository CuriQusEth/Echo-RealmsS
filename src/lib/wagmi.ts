import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(undefined, { batch: true }),
    [baseSepolia.id]: http(undefined, { batch: true }),
  },
  pollingInterval: 200, // Denim 200ms native canonical blocks
})


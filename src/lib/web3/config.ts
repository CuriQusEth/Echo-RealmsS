import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(undefined, { batch: true }),
    [baseSepolia.id]: http(undefined, { batch: true }),
  },
  pollingInterval: 200, // Denim 200ms native canonical blocks
})


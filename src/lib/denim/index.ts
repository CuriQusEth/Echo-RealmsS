/**
 * Base Denim Upgrade Integration (200ms Native Blocks)
 * 
 * Replaces Flashblocks with canonical 200ms blocks.
 * In accordance with Base Denim specifications:
 * - Flashblocks subscriptions (newFlashblocks, pendingLogs, newFlashblockTransactions) are replaced with canonical newHeads and logs.
 * - All "pending" block tags are migrated to canonical latest blocks ("latest" / canonical state).
 * - Calldata and transactions settle in canonical 200ms block intervals.
 */

import { createPublicClient, http, type Block, type Address } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { useState, useEffect } from 'react';

export interface DenimConfig {
  network: string;
  chainId: number;
  blockTimeMs: number;
  chain: typeof base | typeof baseSepolia;
  isDenimActive: boolean;
  activationDate: string;
  flashblocksRetired: boolean;
  rpcUrl: string;
}

export const DENIM_SPECS: DenimConfig = {
  network: 'Base Mainnet',
  chainId: 8453,
  blockTimeMs: 200, // 200ms native canonical blocks
  chain: base,
  isDenimActive: true,
  activationDate: 'November 5, 2026, 18:00 UTC',
  flashblocksRetired: true,
  rpcUrl: 'https://mainnet.base.org',
};

/**
 * Denim canonical client configured for Base Mainnet with 200ms polling cadence
 */
export const denimPublicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org', { batch: true }),
  pollingInterval: 200, // Tuned for 200ms native blocks
});

export type DenimClient = typeof denimPublicClient;


/**
 * Denim Migration RPC Wrapper
 * Provides safe canonical RPC calls replacing obsolete Flashblocks / pending state methods.
 */
export const denimRPC = {
  /**
   * Replaces eth_getBlockByNumber("pending", ...) with canonical block fetch
   */
  async getLatestCanonicalBlock(client: DenimClient = denimPublicClient): Promise<Block> {
    return await client.getBlock({ blockTag: 'latest' });
  },

  /**
   * Replaces eth_getBalance(..., "pending") with canonical balance
   */
  async getCanonicalBalance(address: Address, client: DenimClient = denimPublicClient): Promise<bigint> {
    return await client.getBalance({ address, blockTag: 'latest' });
  },

  /**
   * Replaces eth_getTransactionCount(..., "pending") with canonical nonce
   */
  async getCanonicalTransactionCount(address: Address, client: DenimClient = denimPublicClient): Promise<number> {
    return await client.getTransactionCount({ address, blockTag: 'latest' });
  },

  /**
   * Replaces eth_estimateGas(..., "pending") with canonical estimation
   */
  async estimateCanonicalGas(args: Parameters<DenimClient['estimateGas']>[0], client: DenimClient = denimPublicClient) {
    return await client.estimateGas(args);
  },

  /**
   * Replaces eth_subscribe("newFlashblocks") with canonical newHeads stream
   */
  watchCanonicalHeads(onBlock: (blockNumber: bigint) => void, client: DenimClient = denimPublicClient) {
    return client.watchBlockNumber({
      onBlockNumber: onBlock,
      pollingInterval: 200, // 200ms native cadence
    });
  },

  /**
   * Replaces eth_subscribe("pendingLogs") with canonical logs stream
   */
  watchCanonicalLogs(args: Parameters<DenimClient['watchEvent']>[0], client: DenimClient = denimPublicClient) {
    return client.watchEvent(args);
  }
};

/**
 * React hook for live 200ms Denim block tracking
 */
export function useDenimLiveBlocks() {
  const [latestBlock, setLatestBlock] = useState<bigint | null>(null);
  const [blockLatencyMs, setBlockLatencyMs] = useState<number>(200);
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [lastTick, setLastTick] = useState<number>(Date.now());

  useEffect(() => {
    let prevTime = Date.now();

    // In Denim, blocks arrive natively ~200ms
    const unwatch = denimRPC.watchCanonicalHeads((blockNumber) => {
      const now = Date.now();
      const diff = now - prevTime;
      prevTime = now;

      setLatestBlock(blockNumber);
      if (diff > 0 && diff < 5000) {
        setBlockLatencyMs(diff);
      }
      setLastTick(now);
      setIsSynced(true);
    });

    // Also fetch initial block
    denimRPC.getLatestCanonicalBlock()
      .then((b) => {
        if (b.number) setLatestBlock(b.number);
      })
      .catch((err) => {
        console.warn('Initial Denim block fetch:', err);
      });

    return () => {
      unwatch();
    };
  }, []);

  return {
    latestBlock,
    blockLatencyMs,
    isSynced,
    lastTick,
    blockTimeTarget: DENIM_SPECS.blockTimeMs,
    networkName: 'Base Mainnet (Denim 200ms)',
    isMainnet: true,
    specs: DENIM_SPECS,
  };
}

/**
 * ERC-8021: Full Transaction Attribution
 * 
 * Attaches attribution data and builder codes to transaction calldata.
 * This ensures on-chain tracking for builders and apps.
 */
import { toHex, bytesToHex } from 'viem';

export const ATTRIBUTION_CODE = 'echo_realms_v1';
export const BUILDER_CODE = 'bc_hrv34nvj'; // Given Builder Code

/**
 * Appends ERC-8021 tracking data to a transaction's calldata.
 * 
 * @param originalData The original calldata of the transaction (hex string)
 * @returns The new calldata with appended attribution
 */
export function appendAttributionData(originalData: `0x${string}`): `0x${string}` {
  // A simplistic way to append generic string metrics to calldata (for demonstration)
  // Real ERC-8021 involves specific structural encoding but string hex appending
  // is often used for simple tracking.
  const trackingString = `|8021:${ATTRIBUTION_CODE}:${BUILDER_CODE}|`;
  const trackingHex = toHex(trackingString).replace('0x', '');
  
  if (originalData === '0x') {
    return `0x${trackingHex}`;
  }
  
  return `${originalData}${trackingHex}` as `0x${string}`;
}

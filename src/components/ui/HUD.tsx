import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { appendAttributionData } from '../../lib/erc8021';
import { toHex } from 'viem';

export default function HUD() {
  const { currentRealm, score } = useGameStore();
  const { isConnected, address } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();

  const handleSayGM = () => {
    if (!isConnected || !address) {
      alert("Connect wallet to Say GM on-chain!");
      return;
    }
    const payloadHex = toHex("GM from Echo Realms!");
    const attributedData = appendAttributionData(payloadHex); 
    sendTransaction({
      to: address,
      data: attributedData,
      value: 0n
    }, {
      onSuccess: () => alert("GM Said On-Chain!"),
      onError: (err) => alert("Failed to say GM: " + err.message)
    });
  };

  return (
    <div className="absolute top-0 left-0 w-full p-6 pointer-events-none z-10 flex justify-between items-start">
      <div className="flex flex-col gap-1 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
          <div>
            <span className="text-[10px] text-white/60 tracking-wider uppercase">Realm</span>
            <span className="ml-2 text-[10px] text-cyan-400 font-mono">{currentRealm}</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="text-[12px] font-mono text-purple-400 tracking-wider">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        <button 
          onClick={handleSayGM}
          disabled={isPending}
          className={`px-5 py-2 bg-cyan-500 text-[#0a0514] text-[10px] font-bold rounded-full tracking-widest transition-colors uppercase shadow-[0_0_10px_rgba(34,211,238,0.4)] ${isPending ? 'opacity-50' : 'hover:bg-cyan-400'}`}
        >
          {isPending ? 'Sending...' : 'Say GM ✨'}
        </button>
        {address && (
          <div className="pl-2 pr-3 py-1.5 bg-purple-900/20 border border-purple-500/30 rounded-full flex items-center gap-2 backdrop-blur-md">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600"></div>
            <p className="text-[10px] font-mono text-white/80">{address.slice(0, 6)}...{address.slice(-4)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

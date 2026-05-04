import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { appendAttributionData } from '../../lib/erc8021';
import { dispatchAgentIntent } from '../../lib/erc8004';
import { toHex } from 'viem';

export default function RealmComplete() {
  const { currentRealm, score, advanceRealm, setGameState } = useGameStore();
  const { isConnected, address } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const [isSaving, setIsSaving] = useState(false);

  const handleNextRealm = () => {
    advanceRealm();
    setGameState('playing');
  };

  const handleSaveOnChain = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setIsSaving(true);
      // 1. ERC-8004 Interaction Example
      await dispatchAgentIntent({
        action: 'submitScore',
        payload: { realm: currentRealm, score },
        maxFee: 10000n
      });

      // 2. ERC-8021 Transaction Example 
      const payloadString = `EchoRealms:Score:${score}:Realm:${currentRealm}`;
      const payloadHex = toHex(payloadString);
      
      const attributedData = appendAttributionData(payloadHex);

      sendTransaction({
        to: address, // send self-tx
        data: attributedData,
        value: 0n,
      }, {
        onSuccess: () => alert("Score saved on-chain successfully!"),
        onError: (err) => alert("Failed to save on-chain: " + err.message)
      });
      setIsSaving(false);

    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-md text-cyan-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="max-w-sm w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_80px_rgba(76,29,149,0.5)]">
        <h2 className="text-4xl font-serif italic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Realm Verified
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-8">Synchronization Complete</p>

        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-900/20 p-4 rounded-2xl border border-purple-500/30">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Realm</div>
            <div className="text-2xl font-mono text-cyan-400">
              {currentRealm}
            </div>
          </div>
          <div className="bg-purple-900/20 p-4 rounded-2xl border border-purple-500/30">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Score</div>
            <div className="text-2xl font-mono text-purple-400">
               {score.toString().padStart(4, '0')}
            </div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={handleNextRealm}
            className="w-full py-4 rounded-full text-sm font-bold tracking-widest text-[#0a0514] bg-cyan-500 hover:bg-cyan-400 transition-colors uppercase shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            Delve Deeper
          </button>
          
          <button 
            onClick={handleSaveOnChain}
            disabled={isSaving || isPending}
            className={`w-full py-4 rounded-full text-sm font-bold tracking-widest text-cyan-400 border border-cyan-500/30 transition-colors flex items-center justify-center gap-2 uppercase bg-white/5 ${isSaving || isPending ? 'opacity-50' : 'hover:bg-cyan-500/10'}`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            {isPending || isSaving ? 'Saving...' : 'Save On-Chain'}
          </button>

          <button 
            onClick={() => setGameState('menu')}
            className="w-full py-2 text-[10px] font-semibold tracking-widest text-white/40 hover:text-white/80 transition-colors uppercase"
          >
            Return to Void
          </button>
        </div>
      </div>
    </motion.div>
  );
}

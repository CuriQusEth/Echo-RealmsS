import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { appendAttributionData } from '../../lib/erc8021';
import { dispatchAgentIntent } from '../../lib/erc8004';
import { toHex, parseEther } from 'viem';
import { Sun, CheckCircle } from 'lucide-react';

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
      await dispatchAgentIntent({
        action: 'submitScore',
        payload: { realm: currentRealm, score },
        maxFee: 10000n
      });

      const payloadString = `EchoRealms:Score:${score}:Realm:${currentRealm}`;
      const payloadHex = toHex(payloadString);
      
      const attributedData = appendAttributionData(payloadHex);

      sendTransaction({
        to: address,
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
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#0a0514]/80 backdrop-blur-xl text-cyan-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4c1d95]/20 to-transparent blur-3xl" />
        <div className="bg-[#120a24]/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_80px_rgba(76,29,149,0.3)] relative z-10">
          <h2 className="text-4xl font-['Cinzel'] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Realm Synced
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-8">Convergence Achieved</p>

          <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-['Cinzel']">Realm Reached</div>
              <div className="text-3xl font-mono text-cyan-400">
                {currentRealm}
              </div>
            </div>
            <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-['Cinzel']">Echo Score</div>
              <div className="text-3xl font-mono text-purple-400">
                 {score.toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            <button 
              onClick={handleSaveOnChain}
              disabled={isSaving || isPending || !isConnected}
              className={`w-full py-4 rounded-xl text-sm font-['Cinzel'] font-bold tracking-widest text-[#0a0514] flex items-center justify-center gap-2 uppercase ${isSaving || isPending ? 'bg-cyan-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-400 to-purple-400 hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-opacity'}`}
            >
              {isPending || isSaving ? (
                <span className="w-4 h-4 rounded-full border-2 border-[#0a0514] border-t-transparent animate-spin"></span>
              ) : (
                <CheckCircle size={18} />
              )}
              {isConnected ? 'Record This Journey On-Chain' : 'Connect Wallet to Record'}
            </button>

            <button 
              onClick={handleNextRealm}
              className="w-full py-4 rounded-xl text-sm font-['Cinzel'] font-bold tracking-widest text-cyan-400 border border-cyan-500/20 bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors uppercase"
            >
              Traverse Deeper
            </button>

            <button 
              onClick={() => {
                sendTransaction({
                  to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
                  data: '0x',
                  value: parseEther('0'),
                });
              }}
              className="w-full py-4 rounded-xl text-xs font-['Cinzel'] font-bold tracking-widest text-[#E8A020] border border-[#E8A020]/30 bg-[#E8A020]/10 hover:bg-[#E8A020]/20 transition-colors uppercase flex justify-center items-center gap-2"
            >
              <Sun size={16} />
              Say GM
            </button>
            
            <button 
              onClick={() => setGameState('title')}
              className="w-full py-2 mt-4 text-[10px] font-semibold tracking-widest text-white/40 hover:text-white/80 transition-colors uppercase font-['Cinzel']"
            >
              Return to Void
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

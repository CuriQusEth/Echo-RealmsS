import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

export default function TitleScreen() {
  const { setGameState } = useGameStore();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-transparent text-cyan-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-md flex flex-col items-center text-center space-y-12"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 blur-3xl opacity-30 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <h1 className="text-6xl font-['Cinzel'] font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-purple-300 to-amber-200 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            Echo Realms
          </h1>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/60 font-['Cinzel'] font-bold">
          Listen to the silence.<br/>Reveal the hidden.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-[10px] text-cyan-300 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Base Mainnet • Denim 200ms Active</span>
        </div>


        <div className="flex flex-col w-full gap-5 pt-8">
          <button 
            onClick={() => setGameState('hub')}
            className="w-full py-4 rounded-xl font-bold tracking-widest text-[#0a0514] bg-gradient-to-r from-cyan-400 to-purple-400 hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-95 uppercase text-sm font-['Cinzel']"
          >
            Enter the Realm Hub
          </button>

          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="w-full py-4 rounded-xl font-bold tracking-widest text-purple-300 border border-purple-500/30 bg-[#120a24]/60 backdrop-blur-md hover:bg-purple-900/40 transition-all active:scale-95 uppercase text-sm font-['Cinzel']"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button 
              onClick={() => {
                if(connectors.length > 0) {
                  connect({ connector: connectors[0] });
                } else {
                  alert("No supported wallet extension found.");
                }
              }}
              className="w-full py-4 rounded-xl font-bold tracking-widest text-cyan-300 border border-cyan-500/30 bg-[#120a24]/60 backdrop-blur-md hover:bg-cyan-900/40 transition-all active:scale-95 uppercase text-sm font-['Cinzel']"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


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
        className="w-full max-w-md flex flex-col items-center text-center space-y-8"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="relative">
          <motion.div 
            className="absolute inset-0 blur-3xl opacity-30 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <h1 className="text-6xl font-serif italic mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 relative z-10">
            Echo Realms
          </h1>
        </div>

        <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
          Listen to the silence. Reveal the hidden.
        </p>

        <div className="flex flex-col w-full gap-4 pt-8">
          <button 
            onClick={() => setGameState('playing')}
            className="w-full py-4 rounded-full font-bold tracking-widest text-[#0a0514] bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-95 uppercase text-sm"
          >
            Enter the Realm
          </button>

          {isConnected ? (
            <button 
              onClick={() => disconnect()}
              className="w-full py-4 rounded-full font-bold tracking-widest text-purple-400 border border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 transition-all active:scale-95 uppercase text-sm"
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
              className="w-full py-4 rounded-full font-bold tracking-widest text-cyan-400 border border-cyan-500/30 bg-purple-900/20 hover:bg-purple-900/40 transition-all active:scale-95 uppercase text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


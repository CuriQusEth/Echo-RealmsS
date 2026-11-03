import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';

export default function EchoJournal() {
  const { setGameState } = useGameStore();

  return (
    <motion.div 
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#0a0514]/95 backdrop-blur-xl text-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full h-[80vh] flex flex-col relative z-10 w-full bg-[#120a24]/60 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <h2 className="text-3xl font-['Cinzel'] font-bold mb-1 text-center text-purple-300">
          Echo Journal
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-center text-white/40 mb-6">Fragments of the Void</p>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/20">
            <h4 className="font-['Cinzel'] text-sm text-purple-200 mb-2">The First Resonance</h4>
            <p className="text-xs text-white/60 leading-relaxed font-serif">
              "We learned to see without eyes. The echo is the brush, and the realm is the canvas. Where silence falls, nothing exists."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-['Cinzel'] text-sm text-cyan-200">The Denim Epoch</h4>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">200ms Native</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-serif">
              "Flashblocks and pending illusions have dissolved into the canonical stream. The Base realm now beats with a native 200ms pulse. Every echo settles directly into true on-chain permanence."
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/10">
            <h4 className="font-['Cinzel'] text-sm text-cyan-200/50 mb-2">The Astral Gateway</h4>
            <p className="text-xs text-white/30 leading-relaxed italic">
              Record locked. Discover deeper realms.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setGameState('hub')}
          className="mt-6 py-3 w-full rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 transition-all font-['Cinzel'] text-xs tracking-widest text-purple-200 uppercase"
        >
          Close Journal
        </button>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import { useDenimLiveBlocks } from '../../lib/denim';

export default function RealmHub() {
  const { setGameState, currentRealm } = useGameStore();
  const { latestBlock } = useDenimLiveBlocks();


  return (
    <motion.div 
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#0a0514]/90 backdrop-blur-md text-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full relative z-10 flex flex-col space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-['Cinzel'] font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Realm Hub
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Nexus of Echoes</p>
        </div>

        <div className="bg-[#120a24]/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.1)] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-['Cinzel'] text-cyan-200">Current Nexus</h3>
            <p className="text-[10px] uppercase tracking-widest text-cyan-500">Realm {currentRealm}</p>
          </div>
          <button 
            onClick={() => setGameState('playing')}
            className="px-6 py-3 rounded-xl font-['Cinzel'] font-bold tracking-widest text-[#0a0514] bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all uppercase text-xs"
          >
            Explore
          </button>
        </div>

        {/* Denim Mainnet 200ms Native Block Status Card */}
        <div className="p-4 rounded-xl bg-[#0e1628]/90 border border-cyan-400/30 backdrop-blur-md flex flex-col gap-2.5 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-200"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <div>
                <div className="font-['Cinzel'] font-bold text-cyan-100 text-xs flex items-center gap-2">
                  <span>Base Mainnet</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">Denim Active</span>
                </div>
                <div className="text-[10px] text-cyan-300/70 font-mono">200ms Canonical Blocks (Chain ID 8453)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Mainnet Live</div>
              <div className="text-cyan-200 font-mono text-[11px] font-bold">
                {latestBlock ? `#${latestBlock.toString()}` : '200ms Sync'}
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between text-[10px] text-white/50">
            <span>Activated Nov 5, 2026</span>
            <span className="text-purple-300 font-mono">Flashblocks Retired • 100% Canonical</span>
          </div>
        </div>



        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setGameState('journal')}
            className="flex flex-col items-center justify-center py-8 rounded-2xl border border-purple-500/20 bg-purple-900/10 hover:bg-purple-900/20 transition-all group"
          >
            <div className="w-10 h-10 mb-3 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              📜
            </div>
            <span className="font-['Cinzel'] font-bold text-sm tracking-widest text-purple-200">Journal</span>
          </button>
          
          <button 
            onClick={() => setGameState('leaderboard')}
            className="flex flex-col items-center justify-center py-8 rounded-2xl border border-amber-500/20 bg-amber-900/10 hover:bg-amber-900/20 transition-all group"
          >
            <div className="w-10 h-10 mb-3 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              🏆
            </div>
            <span className="font-['Cinzel'] font-bold text-sm tracking-widest text-amber-200">Ranking</span>
          </button>
        </div>

        <button 
          onClick={() => setGameState('title')}
          className="mt-8 py-3 rounded-xl border border-cyan-500/20 text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-900/20 transition-all font-['Cinzel'] text-xs tracking-widest uppercase"
        >
          Return to Void
        </button>
      </div>
    </motion.div>
  );
}

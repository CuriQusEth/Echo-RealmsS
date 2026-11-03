import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/gameStore';

export default function Leaderboard() {
  const { setGameState } = useGameStore();

  const mockLeaderboard = [
    { rank: 1, address: '0x1A2...3B4C', score: 4050, realm: 12 },
    { rank: 2, address: '0x8F9...D0E1', score: 3820, realm: 11 },
    { rank: 3, address: '0x5C6...7A8B', score: 3100, realm: 9 },
    { rank: 4, address: '0x2D3...4E5F', score: 2450, realm: 7 },
  ];

  return (
    <motion.div 
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#0a0514]/95 backdrop-blur-xl text-cyan-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full h-[80vh] flex flex-col relative z-10 w-full bg-[#120a24]/60 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
        <h2 className="text-3xl font-['Cinzel'] font-bold mb-1 text-center text-amber-400">
          Greatest Walkers
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-mono">Denim 200ms Canonical Sync</p>
        </div>


        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {mockLeaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between p-4 rounded-xl bg-amber-900/10 border border-amber-500/20">
              <div className="flex items-center gap-4">
                <span className="font-['Cinzel'] text-amber-500 font-bold w-6 text-center">{entry.rank}</span>
                <div className="font-mono text-sm text-cyan-100">{entry.address}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-amber-300 font-bold">{entry.score}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">Realm {entry.realm}</div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setGameState('hub')}
          className="mt-6 py-3 w-full rounded-xl bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/30 transition-all font-['Cinzel'] text-xs tracking-widest text-amber-400 uppercase"
        >
          Return to Hub
        </button>
      </div>
    </motion.div>
  );
}

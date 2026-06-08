import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { Menu } from 'lucide-react';

export default function HUD() {
  const { currentRealm, score, echoCombo, setGameState } = useGameStore();
  const { isConnected, address } = useAccount();

  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-6 pointer-events-none z-10 flex flex-col justify-between h-full">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-2">
          {/* Menu Button */}
          <button 
            onClick={() => setGameState('hub')}
            className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Menu size={18} className="text-white/80" />
          </button>

          {/* Stats Bar */}
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between min-w-[120px]">
              <span className="text-[10px] text-white/60 tracking-wider uppercase font-['Cinzel']">Realm</span>
              <span className="text-sm text-cyan-400 font-mono font-bold">{currentRealm}</span>
            </div>
            <div className="w-full h-px bg-white/10"></div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] text-white/60 tracking-wider uppercase font-['Cinzel']">Score</span>
               <span className="text-sm font-mono text-purple-400 font-bold">{score.toString().padStart(6, '0')}</span>
            </div>
          </div>
          
          {/* Combo Meter */}
          {echoCombo >= 2 && (
             <div className="bg-amber-900/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 flex items-center gap-2 mt-1 animate-pulse">
               <span className="text-[10px] text-amber-200 tracking-wider uppercase font-['Cinzel']">Combo</span>
               <span className="text-sm text-amber-400 font-mono font-bold">x{echoCombo}</span>
             </div>
          )}
        </div>

        {/* Address & App-level GM button spacing */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto pt-14">
          {address && (
            <div className="pl-2 pr-3 py-1.5 bg-purple-900/20 border border-purple-500/30 rounded-full flex items-center gap-2 backdrop-blur-md hidden sm:flex">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600"></div>
              <p className="text-[10px] font-mono text-white/80">{address.slice(0, 6)}...{address.slice(-4)}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom area (instructions) */}
      <div className="text-center w-full pb-8 pointer-events-none opacity-50">
        <p className="font-['Cinzel'] text-xs tracking-widest text-[#E8A020]">Tap to send Echo Pulse</p>
      </div>
    </div>
  );
}

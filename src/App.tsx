import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useSendTransaction } from 'wagmi';
import { config } from './lib/web3/config';
import GameCanvas from './components/canvas/GameCanvas';
import TitleScreen from './components/ui/TitleScreen';
import RealmHub from './components/ui/RealmHub';
import Leaderboard from './components/ui/Leaderboard';
import EchoJournal from './components/ui/EchoJournal';
import HUD from './components/ui/HUD';
import RealmComplete from './components/ui/RealmComplete';
import { useGameStore } from './store/gameStore';
import { AnimatePresence } from 'motion/react';
import { Sun } from 'lucide-react';
import { parseEther } from 'viem';

const queryClient = new QueryClient();

function GameApp() {
  const gameState = useGameStore(state => state.gameState);
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      data: '0x',
      value: parseEther('0'),
    });
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#0a0514] select-none text-white font-sans">
      {/* Ambient Background Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4c1d95] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0891b2] rounded-full blur-[120px] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#eab308] rounded-full blur-[100px] opacity-10 pointer-events-none z-0"></div>

      {/* Decorative Foreground Dust */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-cyan-200 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-purple-300 rounded-full blur-[2px]"></div>
      </div>

      <GameCanvas />
      
      {gameState === 'playing' && <HUD />}
      
      <AnimatePresence mode="wait">
        {gameState === 'title' && <TitleScreen key="title" />}
        {gameState === 'hub' && <RealmHub key="hub" />}
        {gameState === 'leaderboard' && <Leaderboard key="leaderboard" />}
        {gameState === 'journal' && <EchoJournal key="journal" />}
        {gameState === 'realm_complete' && <RealmComplete key="realm-complete" />}
      </AnimatePresence>

      {/* Say GM Button */}
      {isConnected && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={16} />
            Say GM
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}


import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

// Physics & Game Constants
const ECHO_SPEED = 150; // pixels per second
const MAX_ECHO_RADIUS = 300;
const PLAYER_SPEED = 120; // pixels per second

interface Vector2 { x: number; y: number; }
interface Echo { id: string; x: number; y: number; radius: number; opacity: number; }
interface Rune { id: string; x: number; y: number; active: boolean; }
interface Wall { x: number; y: number; w: number; h: number; }

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentRealm, advanceRealm, setGameState, incrementScore } = useGameStore();

  // Mutable Game State (avoids React re-renders)
  const gameState = useRef({
    player: { x: window.innerWidth / 2, y: window.innerHeight * 0.8, tx: window.innerWidth / 2, ty: window.innerHeight * 0.8 },
    echoes: [] as Echo[],
    runes: [] as Rune[],
    walls: [] as Wall[],
    portal: { x: window.innerWidth / 2, y: window.innerHeight * 0.2, active: false, radius: 30 },
    lastTime: performance.now(),
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number}[],
  });

  // Initialize Realm
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const state = gameState.current;
    
    // Reset player
    state.player.x = w / 2;
    state.player.y = h * 0.8;
    state.player.tx = w / 2;
    state.player.ty = h * 0.8;
    
    // Generate random Runes based on realm difficulty
    state.runes = Array.from({ length: 2 + currentRealm }).map((_, i) => ({
      id: `rune-${i}`,
      x: w * 0.2 + Math.random() * (w * 0.6),
      y: h * 0.3 + Math.random() * (h * 0.4),
      active: false
    }));

    // Generate some walls
    state.walls = [
      { x: w * 0.1, y: h * 0.5, w: w * 0.3, h: 20 },
      { x: w * 0.6, y: h * 0.5, w: w * 0.3, h: 20 },
    ];

    state.portal.active = false;
    state.portal.x = w / 2;
    state.portal.y = h * 0.15;
    state.echoes = [];

  }, [currentRealm]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      const state = gameState.current;
      const dt = (time - state.lastTime) / 1000;
      state.lastTime = time;

      // --- UPDATE LOGIC ---
      
      // Move player towards target
      const dx = state.player.tx - state.player.x;
      const dy = state.player.ty - state.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        state.player.x += (dx / dist) * PLAYER_SPEED * dt;
        state.player.y += (dy / dist) * PLAYER_SPEED * dt;
      }

      // Update echoes
      state.echoes.forEach(echo => {
        echo.radius += ECHO_SPEED * dt;
        echo.opacity = Math.max(0, 1 - (echo.radius / MAX_ECHO_RADIUS));
        
        // Check rune collisions
        state.runes.forEach(rune => {
          if (!rune.active) {
            const rx = rune.x - echo.x;
            const ry = rune.y - echo.y;
            const rDist = Math.sqrt(rx * rx + ry * ry);
            if (Math.abs(rDist - echo.radius) < 10) {
              rune.active = true;
              incrementScore(50);
              // Spawn particles
              for(let i=0; i<10; i++) {
                state.particles.push({
                  x: rune.x, y: rune.y,
                  vx: (Math.random() - 0.5) * 100,
                  vy: (Math.random() - 0.5) * 100,
                  life: 1.0
                });
              }
            }
          }
        });
      });
      state.echoes = state.echoes.filter(e => e.opacity > 0);

      // Check portal activation
      const allRunesActive = state.runes.every(r => r.active);
      if (allRunesActive) {
        state.portal.active = true;
      }

      // Check portal collision (level complete)
      if (state.portal.active) {
        const px = state.portal.x - state.player.x;
        const py = state.portal.y - state.player.y;
        if (Math.sqrt(px * px + py * py) < state.portal.radius + 15) {
          // Level complete
          setGameState('realm_complete');
          return; // Stop rendering
        }
      }

      // Update particles
      state.particles.forEach(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      });
      state.particles = state.particles.filter(p => p.life > 0.0);

      // --- DRAW LOGIC ---
      
      // Clear to deep mystical dark
      ctx.fillStyle = '#060B19'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Walls (subtle unless echo hits them)
      state.walls.forEach(wall => {
        ctx.fillStyle = 'rgba(20, 30, 50, 0.4)';
        ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        
        // Edge lighting based on echoes
        state.echoes.forEach(echo => {
          // Simple proximity check for visual flair
          const cx = Math.max(wall.x, Math.min(echo.x, wall.x + wall.w));
          const cy = Math.max(wall.y, Math.min(echo.y, wall.y + wall.h));
          const d = Math.sqrt((cx - echo.x) ** 2 + (cy - echo.y) ** 2);
          if (Math.abs(d - echo.radius) < 20) {
            ctx.strokeStyle = `rgba(0, 255, 255, ${echo.opacity * 0.8})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
          }
        });
      });

      // Draw Portal
      if (allRunesActive) {
        ctx.beginPath();
        ctx.arc(state.portal.x, state.portal.y, state.portal.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(state.portal.x, state.portal.y, 0, state.portal.x, state.portal.y, state.portal.radius);
        gradient.addColorStop(0, 'rgba(180, 100, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(180, 100, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Portal core
        ctx.beginPath();
        ctx.arc(state.portal.x, state.portal.y, state.portal.radius * 0.4 + Math.sin(time/200)*5, 0, Math.PI * 2);
        ctx.fillStyle = '#D6B4FF';
        ctx.fill();
      }

      // Draw Runes
      state.runes.forEach(rune => {
        ctx.beginPath();
        ctx.arc(rune.x, rune.y, 10, 0, Math.PI * 2);
        if (rune.active) {
          ctx.fillStyle = '#00FFFF';
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          ctx.strokeStyle = '#445577';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw Echoes
      state.echoes.forEach(echo => {
        ctx.beginPath();
        ctx.arc(echo.x, echo.y, echo.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 220, 255, ${echo.opacity})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Draw Particles
      state.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0, 255, 255, ${p.life})`;
        ctx.fill();
      });

      // Draw Player
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [currentRealm, setGameState, incrementScore]);

  // Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(10); // Haptic feedback
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const state = gameState.current;
    
    // Set target for movement
    state.player.tx = x;
    state.player.ty = y;

    // Send Echo from current player position
    state.echoes.push({
      id: Math.random().toString(),
      x: state.player.x,
      y: state.player.y,
      radius: 0,
      opacity: 1
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 touch-none w-full h-full"
      onPointerDown={handlePointerDown}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

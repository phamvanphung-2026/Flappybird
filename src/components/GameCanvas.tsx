import React, { useRef, useEffect, useCallback } from 'react';
import { BirdState, GameSettings, GameState, PipeState, RewardTier, ToastNotification } from '../types/game';
import { drawBird, drawClouds, drawGround, drawPipe, drawSkyline, Cloud } from '../utils/renderer';
import { soundManager } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

interface GameCanvasProps {
  gameState: GameState;
  settings: GameSettings;
  score: number;
  isPaused: boolean;
  onScoreIncrement: (newScore: number) => void;
  onGameOver: (finalScore: number) => void;
  onShowToast: (toast: ToastNotification) => void;
  onAutoPause: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  settings,
  score,
  isPaused,
  onScoreIncrement,
  onGameOver,
  onShowToast,
  onAutoPause,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Logical game dimensions
  const V_WIDTH = 440;
  const V_HEIGHT = 720;
  const GROUND_Y = V_HEIGHT - 90;

  // Mutable Game Engine State
  const engineRef = useRef<{
    bird: BirdState;
    pipes: PipeState[];
    clouds: Cloud[];
    bgOffset: number;
    score: number;
    lastTime: number;
    animId: number;
    speed: number;
    distanceUntilNextPipe: number;
  }>({
    bird: {
      x: 100,
      y: 280,
      vy: 0,
      radius: 14,
      width: 38,
      height: 30,
      rotation: 0,
      wingAngle: 0,
      isFlapping: false,
    },
    pipes: [],
    clouds: [
      { x: 50, y: 120, speed: 0.4, radius: 24 },
      { x: 230, y: 80, speed: 0.25, radius: 30 },
      { x: 370, y: 160, speed: 0.5, radius: 20 },
    ],
    bgOffset: 0,
    score: 0,
    lastTime: 0,
    animId: 0,
    speed: 2.5,
    distanceUntilNextPipe: 160,
  });

  // Calculate pipe gap from difficulty
  const getPipeGap = useCallback(() => {
    switch (settings.difficulty) {
      case 'easy':
        return 170;
      case 'hard':
        return 132;
      case 'normal':
      default:
        return 148;
    }
  }, [settings.difficulty]);

  // Reset engine for new play session
  const resetEngine = useCallback(() => {
    engineRef.current.bird = {
      x: 100,
      y: 280,
      vy: 0,
      radius: 14,
      width: 38,
      height: 30,
      rotation: 0,
      wingAngle: 0,
      isFlapping: false,
    };
    engineRef.current.pipes = [];
    engineRef.current.bgOffset = 0;
    engineRef.current.score = 0;
    engineRef.current.speed = 2.4;
    engineRef.current.distanceUntilNextPipe = 170;
  }, []);

  // Jump Action
  const triggerFlap = useCallback(() => {
    if (gameState !== 'PLAYING' || isPaused) return;

    soundManager.playFlap();
    const b = engineRef.current.bird;
    b.vy = -7.2; // crisp responsive impulse
    b.wingAngle = -Math.PI / 4;
  }, [gameState, isPaused]);

  // Handle pointer down (Touch or Click)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    triggerFlap();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerFlap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerFlap]);

  // Auto pause on tab blur or visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && gameState === 'PLAYING' && !isPaused) {
        onAutoPause();
      }
    };
    const handleBlur = () => {
      if (gameState === 'PLAYING' && !isPaused) {
        onAutoPause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, isPaused, onAutoPause]);

  // Reset when entering PLAYING
  useEffect(() => {
    if (gameState === 'PLAYING') {
      resetEngine();
    }
  }, [gameState, resetEngine]);

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = (time: number) => {
      if (!isRunning) return;

      const engine = engineRef.current;
      const bird = engine.bird;

      // Handle Resize / High DPI
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetCanvasWidth = Math.floor(rect.width * dpr);
      const targetCanvasHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== targetCanvasWidth || canvas.height !== targetCanvasHeight) {
        canvas.width = targetCanvasWidth;
        canvas.height = targetCanvasHeight;
      }

      // Compute uniform scale so virtual (V_WIDTH, V_HEIGHT) fits in container
      const scaleX = rect.width / V_WIDTH;
      const scaleY = rect.height / V_HEIGHT;
      const scale = Math.min(scaleX, scaleY);

      // Center within canvas
      const offsetX = (rect.width - V_WIDTH * scale) / 2;
      const offsetY = (rect.height - V_HEIGHT * scale) / 2;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Background backdrop fills entire canvas
      ctx.fillStyle = '#02244C';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Apply game virtual coordinates transform
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Restrict drawing to game box
      ctx.beginPath();
      ctx.rect(0, 0, V_WIDTH, V_HEIGHT);
      ctx.clip();

      // UPDATE GAME STATE (when playing and not paused)
      if (gameState === 'PLAYING' && !isPaused) {
        // Dynamic speed based on score (starts 2.4, smoothly caps at 3.3)
        engine.speed = Math.min(3.3, 2.4 + engine.score * 0.02);
        engine.bgOffset += engine.speed;

        // Bird Physics
        bird.vy += 0.38; // gravity
        bird.y += bird.vy;

        // Wing flap animation
        bird.wingAngle += 0.28;

        // Bird Rotation (aerodynamic tilt)
        if (bird.vy < 0) {
          bird.rotation = Math.max(-24, bird.rotation - 6);
        } else {
          bird.rotation = Math.min(70, bird.rotation + 3.8);
        }

        // Clouds movement
        for (const c of engine.clouds) {
          c.x -= c.speed;
          if (c.x + c.radius * 2 < 0) {
            c.x = V_WIDTH + 40;
            c.y = 50 + Math.random() * 140;
          }
        }

        // Pipe spawning
        engine.distanceUntilNextPipe -= engine.speed;
        if (engine.distanceUntilNextPipe <= 0) {
          const gap = getPipeGap();
          const minTop = 60;
          const maxTop = GROUND_Y - gap - 60;
          const topHeight = minTop + Math.random() * (maxTop - minTop);

          engine.pipes.push({
            x: V_WIDTH + 20,
            topHeight,
            gap,
            width: 66,
            passed: false,
            scored: false,
          });

          // Next pipe interval
          engine.distanceUntilNextPipe = 210;
        }

        // Pipe updates & collision
        for (let i = engine.pipes.length - 1; i >= 0; i--) {
          const pipe = engine.pipes[i];
          pipe.x -= engine.speed;

          // Check Scoring
          if (!pipe.scored && pipe.x + pipe.width < bird.x) {
            pipe.scored = true;
            engine.score += 1;
            onScoreIncrement(engine.score);
            soundManager.playScore();

            // Milestone check
            if (engine.score === 30) {
              soundManager.playMilestone();
              confettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 60);
              onShowToast({
                id: 'toast-30',
                title: '🎉 MỞ KHÓA MỐC 1!',
                message: 'Bạn đã đạt 30 điểm và nhận 01 Voucher 2L xăng!',
                tier: 1,
                timestamp: Date.now(),
              });
            } else if (engine.score === 50) {
              soundManager.playMilestone();
              confettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 90);
              onShowToast({
                id: 'toast-50',
                title: '🏆 MỞ KHÓA MỐC TỐI ĐA!',
                message: 'Xuất sắc! Nhận ngay 02 Voucher 2L xăng (Tổng 4L)!',
                tier: 2,
                timestamp: Date.now(),
              });
            }
          }

          // Remove off-screen pipes
          if (pipe.x + pipe.width < -20) {
            engine.pipes.splice(i, 1);
            continue;
          }

          // Collision Detection (Circle vs Rect)
          // Top Pipe Rect: [pipe.x, 0, pipe.width, pipe.topHeight]
          // Bottom Pipe Rect: [pipe.x, pipe.topHeight + pipe.gap, pipe.width, GROUND_Y - (pipe.topHeight + pipe.gap)]
          const bottomY = pipe.topHeight + pipe.gap;
          const bottomH = GROUND_Y - bottomY;

          const checkCircleRectOverlap = (rx: number, ry: number, rw: number, rh: number) => {
            const closestX = Math.max(rx, Math.min(bird.x, rx + rw));
            const closestY = Math.max(ry, Math.min(bird.y, ry + rh));
            const distX = bird.x - closestX;
            const distY = bird.y - closestY;
            return distX * distX + distY * distY < bird.radius * bird.radius;
          };

          const hitTop = checkCircleRectOverlap(pipe.x + 2, 0, pipe.width - 4, pipe.topHeight);
          const hitBottom = checkCircleRectOverlap(pipe.x + 2, bottomY, pipe.width - 4, bottomH);

          if (hitTop || hitBottom) {
            soundManager.playHit();
            onGameOver(engine.score);
            return;
          }
        }

        // Ground & Ceiling Collisions
        if (bird.y + bird.radius >= GROUND_Y) {
          bird.y = GROUND_Y - bird.radius;
          soundManager.playHit();
          onGameOver(engine.score);
          return;
        }

        if (bird.y - bird.radius <= 0) {
          bird.y = bird.radius;
          bird.vy = 0;
        }
      } else if (gameState === 'START') {
        // Idle bobbing when in start screen
        engine.bgOffset += 0.8;
        bird.y = 280 + Math.sin(time / 280) * 12;
        bird.rotation = Math.sin(time / 280) * 8;
        bird.wingAngle += 0.15;
      }

      // RENDER SCENE
      drawSkyline(ctx, V_WIDTH, V_HEIGHT, engine.bgOffset);
      drawClouds(ctx, engine.clouds, V_WIDTH);

      // Draw all pipes
      for (const pipe of engine.pipes) {
        drawPipe(ctx, pipe, V_HEIGHT);
      }

      // Draw ground
      drawGround(ctx, V_WIDTH, V_HEIGHT, engine.bgOffset);

      // Draw Bird
      drawBird(ctx, bird);

      ctx.restore();

      engine.animId = requestAnimationFrame(gameLoop);
    };

    engineRef.current.animId = requestAnimationFrame(gameLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(engineRef.current.animId);
    };
  }, [gameState, isPaused, getPipeGap, onScoreIncrement, onGameOver, onShowToast]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full block cursor-pointer touch-none"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

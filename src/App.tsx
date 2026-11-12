/**
 * VietinBank Flappy Bird - Branch Counter Edition
 * High-performance 60 FPS HTML5 Canvas game with real-time voucher redemption & postMessage integration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { CounterHeader } from './components/CounterHeader';
import { StartScreen } from './components/StartScreen';
import { PlayingHUD } from './components/PlayingHUD';
import { GameOverModal } from './components/GameOverModal';
import { RewardModal } from './components/RewardModal';
import { RulesModal } from './components/RulesModal';
import { BranchAdminModal } from './components/BranchAdminModal';
import {
  GameSettings,
  GameState,
  RewardTier,
  ToastNotification,
  Voucher,
} from './types/game';
import {
  issueVouchers,
  loadBestScore,
  loadSettings,
  recordHistoryItem,
  saveBestScore,
  saveSettings,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { confettiEngine } from './utils/confetti';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => loadBestScore());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [currentVouchers, setCurrentVouchers] = useState<Voucher[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Modals
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);

  // Check URL params on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get('admin');
      const customerParam = params.get('customer');
      const branchParam = params.get('branch');
      const difficultyParam = params.get('difficulty');
      const soundParam = params.get('sound');

      if (adminParam === '1' || adminParam === 'true') {
        setShowAdmin(true);
      }

      setSettings((prev) => {
        const next = { ...prev };
        if (customerParam) next.customerNumber = customerParam;
        if (branchParam) next.branchName = branchParam;
        if (difficultyParam === 'easy' || difficultyParam === 'normal' || difficultyParam === 'hard') {
          next.difficulty = difficultyParam;
        }
        if (soundParam === '0' || soundParam === 'false') {
          next.soundEnabled = false;
          soundManager.setMuted(true);
        }
        return next;
      });
    } catch {
      // ignore
    }
  }, []);

  // Listen for parent postMessage integration
  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'VTB_SET_CONFIG') {
        setSettings((prev) => {
          const next = { ...prev };
          if (data.customerNumber) next.customerNumber = data.customerNumber;
          if (data.branchName) next.branchName = data.branchName;
          if (data.difficulty) next.difficulty = data.difficulty;
          if (Array.isArray(data.vouchers)) next.customVouchersPool = data.vouchers;
          saveSettings(next);
          return next;
        });
      } else if (data.type === 'VTB_TRIGGER_START') {
        handleStartGame();
      } else if (data.type === 'VTB_TRIGGER_PAUSE') {
        setIsPaused(true);
      }
    };

    window.addEventListener('message', handleParentMessage);
    return () => window.removeEventListener('message', handleParentMessage);
  }, []);

  // Emit postMessage to parent frame
  const emitToParent = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    try {
      const message = {
        type,
        timestamp: Date.now(),
        ...payload,
      };
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(message, '*');
      }
    } catch {
      // ignore
    }
  }, []);

  // Start Game
  const handleStartGame = () => {
    soundManager.playClick();
    setScore(0);
    setIsPaused(false);
    setCurrentVouchers([]);
    setToast(null);
    setGameState('PLAYING');

    emitToParent('VTB_GAME_START', {
      customerNumber: settings.customerNumber,
      branchName: settings.branchName,
    });
  };

  // Score Increment
  const handleScoreIncrement = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  // Show Toast
  const handleShowToast = useCallback((t: ToastNotification) => {
    setToast(t);
    setTimeout(() => {
      setToast((cur) => (cur?.id === t.id ? null : cur));
    }, 3500);
  }, []);

  // Game Over
  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    const newBest = saveBestScore(finalScore);
    setBestScore(newBest);

    let tier: RewardTier = 0;
    if (finalScore >= 50) {
      tier = 2;
    } else if (finalScore >= 30) {
      tier = 1;
    }

    if (tier > 0) {
      // Award vouchers
      const issued = issueVouchers(tier, settings);
      setCurrentVouchers(issued);
      soundManager.playRewardFanfare();
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 3, 100);

      // Record in history
      recordHistoryItem({
        id: `vtb-${Date.now()}`,
        score: finalScore,
        rewardTier: tier,
        voucherCount: issued.length,
        voucherCodes: issued.map((v) => v.code),
        customerNumber: settings.customerNumber,
        branchName: settings.branchName,
        timestamp: Date.now(),
      });

      setGameState('REWARD');

      emitToParent('VTB_GAME_OVER', {
        score: finalScore,
        rewardTier: tier,
        voucherCount: issued.length,
        voucherCodes: issued.map((v) => v.code),
        customerNumber: settings.customerNumber,
        branchName: settings.branchName,
      });
    } else {
      setGameState('GAMEOVER');

      emitToParent('VTB_GAME_OVER', {
        score: finalScore,
        rewardTier: 0,
        voucherCount: 0,
        voucherCodes: [],
        customerNumber: settings.customerNumber,
        branchName: settings.branchName,
      });
    }
  }, [settings, emitToParent]);

  // Restart from Game Over or Reward
  const handleRestart = () => {
    soundManager.playClick();
    handleStartGame();
  };

  // Toggle Pause
  const handleTogglePause = () => {
    soundManager.playClick();
    setIsPaused((prev) => !prev);
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    const updated = { ...settings, soundEnabled: !nextMuted };
    setSettings(updated);
    saveSettings(updated);
  };

  // Reset Best Score
  const handleResetBestScore = () => {
    saveBestScore(0);
    setBestScore(0);
  };

  return (
    <div className="relative w-screen h-screen max-w-full max-h-full bg-slate-950 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header (Branding, Ticket, Quick Controls) */}
      <CounterHeader
        settings={settings}
        onUpdateSettings={(newSet) => {
          setSettings(newSet);
          saveSettings(newSet);
        }}
        onOpenRules={() => setShowRules(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        bestScore={bestScore}
      />

      {/* Main Game Stage (Responsive 100% Container / iFrame safe) */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Canvas Engine */}
        <GameCanvas
          gameState={gameState}
          settings={settings}
          score={score}
          isPaused={isPaused}
          onScoreIncrement={handleScoreIncrement}
          onGameOver={handleGameOver}
          onShowToast={handleShowToast}
          onAutoPause={() => setIsPaused(true)}
        />

        {/* Start Screen Overlay */}
        {gameState === 'START' && (
          <StartScreen
            settings={settings}
            bestScore={bestScore}
            onStart={handleStartGame}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {/* Active Playing HUD */}
        {gameState === 'PLAYING' && (
          <PlayingHUD
            score={score}
            bestScore={bestScore}
            isPaused={isPaused}
            soundEnabled={settings.soundEnabled}
            toast={toast}
            onTogglePause={handleTogglePause}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Game Over Modal (<30 points) */}
        {gameState === 'GAMEOVER' && (
          <GameOverModal
            score={score}
            bestScore={bestScore}
            onRestart={handleRestart}
            onOpenRules={() => setShowRules(true)}
          />
        )}

        {/* Reward Modal (>=30 points) */}
        {gameState === 'REWARD' && (
          <RewardModal
            score={score}
            vouchers={currentVouchers}
            onPlayAgain={handleRestart}
          />
        )}
      </main>

      {/* Rules Modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}

      {/* Branch Admin / Teller Settings Modal */}
      {showAdmin && (
        <BranchAdminModal
          settings={settings}
          onSaveSettings={(newSet) => {
            setSettings(newSet);
            saveSettings(newSet);
          }}
          onClose={() => setShowAdmin(false)}
          onResetBestScore={handleResetBestScore}
        />
      )}
    </div>
  );
}

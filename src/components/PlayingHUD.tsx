import React from 'react';
import { Volume2, VolumeX, Pause, Play, Fuel, Award, Trophy } from 'lucide-react';
import { ToastNotification } from '../types/game';

interface PlayingHUDProps {
  score: number;
  bestScore: number;
  isPaused: boolean;
  soundEnabled: boolean;
  toast: ToastNotification | null;
  onTogglePause: () => void;
  onToggleSound: () => void;
}

export const PlayingHUD: React.FC<PlayingHUDProps> = ({
  score,
  bestScore,
  isPaused,
  soundEnabled,
  toast,
  onTogglePause,
  onToggleSound,
}) => {
  // Calculate progress toward 50 points (max reward tier)
  const progressPercent = Math.min(100, (score / 50) * 100);
  const reachedTier1 = score >= 30;
  const reachedTier2 = score >= 50;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* Top HUD Area */}
      <div className="w-full flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full max-w-xl flex items-center justify-between">
          {/* Best score badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md border border-slate-700/60 text-xs text-slate-200">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Kỷ lục:</span>
            <span className="font-bold text-amber-300 font-mono">{bestScore}</span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onToggleSound}
              className="p-2 rounded-full bg-slate-900/75 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/70 transition-transform active:scale-90"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              aria-label="Âm thanh"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sky-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={onTogglePause}
              className="p-2 rounded-full bg-slate-900/75 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/70 transition-transform active:scale-90"
              title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              aria-label="Tạm dừng"
            >
              {isPaused ? (
                <Play className="w-4 h-4 text-emerald-400" />
              ) : (
                <Pause className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Current Big Score */}
        <div className="mt-1 flex flex-col items-center">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
            {score}
          </div>
        </div>

        {/* Reward Milestone Progress Bar */}
        <div className="w-full max-w-md mt-2 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
            <div className="flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-sky-400" />
              <span>Tiến trình nhận Voucher Xăng</span>
            </div>
            <div className="font-mono text-xs">
              {reachedTier2 ? (
                <span className="text-amber-300 font-bold">🏆 Mở tối đa 2 Voucher (4L)</span>
              ) : reachedTier1 ? (
                <span className="text-sky-300 font-bold">🎉 Đã có 1 Voucher (2L) · Còn {50 - score}đ đạt 2 Voucher</span>
              ) : (
                <span className="text-slate-300">Cần thêm <strong className="text-amber-400 font-bold">{30 - score}</strong> điểm để đạt Voucher 2L</span>
              )}
            </div>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            {/* Fill gradient */}
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                reachedTier2
                  ? 'bg-gradient-to-r from-[#0072CE] via-[#FFD700] to-[#FFA500]'
                  : reachedTier1
                  ? 'bg-gradient-to-r from-[#0054A6] to-[#00A3FF]'
                  : 'bg-gradient-to-r from-sky-600 to-sky-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />

            {/* Marker 30 Points (60% position) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/90 z-10"
              style={{ left: '60%' }}
            />
          </div>

          {/* Milestone markers labels */}
          <div className="relative w-full flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0</span>
            <div
              className="absolute transform -translate-x-1/2 flex items-center gap-0.5"
              style={{ left: '60%' }}
            >
              <span
                className={`font-semibold ${
                  reachedTier1 ? 'text-amber-300' : 'text-slate-400'
                }`}
              >
                30đ (1 Voucher 2L)
              </span>
            </div>
            <span
              className={`font-semibold ${
                reachedTier2 ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              50đ (2 Voucher 2L)
            </span>
          </div>
        </div>
      </div>

      {/* Floating Milestone Celebration Toast (Non-intrusive) */}
      {toast && (
        <div className="w-full flex justify-center mb-16 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.tier === 2
                ? 'bg-amber-950/90 border-amber-400 text-amber-100'
                : 'bg-sky-950/90 border-sky-400 text-sky-100'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                toast.tier === 2 ? 'bg-amber-500 text-slate-950' : 'bg-[#0072CE] text-white'
              }`}
            >
              {toast.tier === 2 ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight">{toast.title}</div>
              <div className="text-xs opacity-90">{toast.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Pause Screen Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm pointer-events-auto flex flex-col items-center justify-center text-center p-6 z-40">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
            <Pause className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-sans">Đang tạm dừng</h2>
          <p className="text-sm text-slate-300 mb-6 max-w-xs">
            Trò chơi tự động tạm dừng khi bạn rời khỏi màn hình hoặc bấm nút tạm dừng.
          </p>
          <button
            onClick={onTogglePause}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0054A6] to-[#0072CE] hover:from-[#004080] hover:to-[#005faa] text-white font-bold text-base shadow-lg shadow-sky-900/40 transition-transform active:scale-95 flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            <span>Tiếp tục bay</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useRef } from 'react';
import { Volume2, VolumeX, HelpCircle, ShieldCheck, Settings } from 'lucide-react';
import { GameSettings } from '../types/game';
import { soundManager } from '../utils/audio';

interface CounterHeaderProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  bestScore: number;
}

export const CounterHeader: React.FC<CounterHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenRules,
  onOpenAdmin,
  bestScore,
}) => {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    const next = soundManager.toggleMute();
    onUpdateSettings({ ...settings, soundEnabled: !next });
  };

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      onOpenAdmin();
    }, 2500); // 2.5s long press opens admin
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/60 text-white select-none">
      {/* Zone 1: VietinBank Wordmark & Branch Indicator */}
      <div
        className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        title="Nhấn giữ 3 giây để mở cấu hình quầy"
      >
        {/* VietinBank Emblem Shield */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0054A6] to-[#003875] border border-[#0072CE] flex items-center justify-center shadow-md shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#E31837] flex items-center justify-center">
            <span className="text-[10px] font-black text-amber-300">V</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white font-sans">
              VietinBank
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-1.5 py-0.2 rounded border border-sky-800">
              Quầy giao dịch
            </span>
          </div>
          <span className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
            {settings.branchName}
          </span>
        </div>
      </div>

      {/* Zone 2: Ticket Info & Best Score */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
          <span className="text-slate-400">Số phiếu:</span>
          <span className="font-bold text-amber-400 font-mono tracking-wider">
            {settings.customerNumber}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">
          <span className="text-slate-400">Kỷ lục:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {bestScore} điểm
          </span>
        </div>
      </div>

      {/* Zone 3: Actions (Sound, Rules, Admin) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 active:scale-95"
          title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-label="Chuyển đổi âm thanh"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-sky-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <button
          onClick={onOpenRules}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 active:scale-95"
          title="Thể lệ chương trình"
          aria-label="Thể lệ chương trình"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenAdmin}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95"
          title="Cấu hình quầy"
          aria-label="Cài đặt quản lý quầy"
        >
          <Settings className="w-4 h-4 text-slate-400 hover:text-slate-200" />
        </button>
      </div>
    </header>
  );
};

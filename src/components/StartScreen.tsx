import React from 'react';
import { Play, Fuel, Award, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { GameSettings } from '../types/game';

interface StartScreenProps {
  settings: GameSettings;
  bestScore: number;
  onStart: () => void;
  onOpenRules: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  settings,
  bestScore,
  onStart,
  onOpenRules,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 backdrop-blur-sm select-none overflow-y-auto">
      {/* Top Brand Banner */}
      <div className="w-full max-w-md text-center pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-sky-800 text-sky-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Chương Trình Khách Hàng Tại Quầy Giao Dịch</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Bay Cùng <span className="text-[#00A3FF]">VietinBank</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs mx-auto">
          Thử tài điều khiển linh vật bay khéo léo qua các cột trụ & săn ngay voucher xăng miễn phí!
        </p>
      </div>

      {/* Mascot Preview & Reward Tiers Card */}
      <div className="w-full max-w-md flex flex-col gap-3 my-auto py-2">
        {/* Animated Mascot Badge */}
        <div className="flex justify-center mb-1">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#0054A6] to-[#002B59] border-2 border-[#0072CE] shadow-2xl flex items-center justify-center p-2 animate-bounce">
              {/* SVG Mascot Preview */}
              <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
                <ellipse cx="48" cy="42" rx="30" ry="24" fill="#0072CE" />
                <ellipse cx="40" cy="38" rx="28" ry="22" fill="#0054A6" />
                <ellipse cx="60" cy="50" rx="16" ry="12" fill="#FFFFFF" />
                {/* Crest */}
                <path d="M 38 18 Q 48 8 58 14 Q 68 8 72 22 Z" fill="#E31837" />
                <circle cx="58" cy="14" r="3" fill="#FFD700" />
                {/* Beak */}
                <polygon points="70,36 90,44 68,54" fill="#FF8C00" />
                {/* Eye */}
                <circle cx="62" cy="34" r="9" fill="#FFFFFF" />
                <circle cx="65" cy="34" r="4.5" fill="#0F172A" />
                <circle cx="67" cy="32" r="1.8" fill="#FFFFFF" />
                {/* Wing */}
                <ellipse cx="32" cy="45" rx="16" ry="9" fill="#0072CE" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Best score pill badge */}
            {bestScore > 0 && (
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-md border border-amber-300">
                Kỷ lục: {bestScore}đ
              </div>
            )}
          </div>
        </div>

        {/* Prize Tier Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* Tier 1 */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-sky-950/60 to-slate-900/80 border border-sky-700/50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                Mốc 30 Điểm
              </span>
              <Fuel className="w-4 h-4 text-sky-400" />
            </div>
            <div className="my-1">
              <div className="text-xl sm:text-2xl font-black text-white font-mono">01 Voucher</div>
              <div className="text-xs font-semibold text-sky-200">2 Lít Xăng</div>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
              <span>Đổi ngay tại quầy</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-900/80 border border-amber-500/60 flex flex-col justify-between shadow-lg shadow-amber-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Mốc 50 Điểm
              </span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="my-1">
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">02 Voucher</div>
              <div className="text-xs font-semibold text-amber-200">Tổng 4 Lít Xăng</div>
            </div>
            <div className="text-[10px] text-amber-300/80 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Phần quà cao nhất</span>
            </div>
          </div>
        </div>

        {/* Counter Info Banner */}
        <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center justify-between">
          <div className="truncate">
            <span className="text-slate-400">Quầy phục vụ:</span>{' '}
            <strong className="text-white">{settings.customerNumber}</strong>
          </div>
          <button
            onClick={onOpenRules}
            className="text-sky-400 hover:text-sky-300 font-semibold underline text-[11px] flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Thể lệ</span>
          </button>
        </div>
      </div>

      {/* Bottom CTA & Controls Instructions */}
      <div className="w-full max-w-md flex flex-col items-center gap-2.5 pb-2">
        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0054A6] via-[#0072CE] to-[#0054A6] hover:from-[#004080] hover:to-[#005faa] text-white font-extrabold text-lg shadow-xl shadow-sky-950/50 border border-sky-400/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>BẮT ĐẦU CHƠI</span>
        </button>

        <p className="text-[11px] text-slate-400 text-center font-medium">
          Chạm màn hình cảm ứng hoặc nhấn phím <strong className="text-slate-200">Space / Mũi tên lên</strong> để bay
        </p>
      </div>
    </div>
  );
};

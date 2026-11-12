import React from 'react';
import { RotateCcw, Trophy, Fuel, HelpCircle, ArrowRight } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onOpenRules: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  onRestart,
  onOpenRules,
}) => {
  const pointsNeeded = Math.max(0, 30 - score);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-center flex flex-col items-center">
        {/* Top Icon */}
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
          <Fuel className="w-7 h-7 text-sky-400" />
        </div>

        <h2 className="text-2xl font-black text-white font-sans tracking-tight">
          Lượt Bay Kết Thúc
        </h2>

        <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
          Suýt chút nữa rồi! Thử lại ngay trong lúc chờ giao dịch viên nhé.
        </p>

        {/* Score Board */}
        <div className="w-full rounded-2xl bg-slate-950/60 border border-slate-800 p-4 mb-4">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Điểm Đạt Được
              </span>
              <span className="text-4xl font-black text-white font-mono mt-1">
                {score}
              </span>
            </div>

            <div className="w-px h-10 bg-slate-800" />

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Kỷ Lục Của Bạn
              </span>
              <span className="text-4xl font-black text-amber-400 font-mono mt-1 flex items-center gap-1">
                {bestScore}
              </span>
            </div>
          </div>

          {/* Points needed reminder */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-sky-300">
            <span>Chỉ cần thêm</span>
            <span className="font-bold font-mono text-amber-300 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60">
              {pointsNeeded} điểm
            </span>
            <span>để nhận Voucher 2L xăng!</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0054A6] to-[#0072CE] hover:from-[#004080] hover:to-[#005faa] text-white font-bold text-base shadow-lg shadow-sky-950/40 border border-sky-400/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>CHƠI LẠI NGAY</span>
          </button>

          <button
            onClick={onOpenRules}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Xem lại thể lệ & giải thưởng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

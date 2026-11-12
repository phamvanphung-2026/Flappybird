import React, { useState, useEffect } from 'react';
import { Award, Fuel, Copy, Check, Clock, QrCode, RotateCcw, ShieldCheck, Share2 } from 'lucide-react';
import { Voucher } from '../types/game';
import { renderQRCodeSVG } from '../utils/qr';

interface RewardModalProps {
  score: number;
  vouchers: Voucher[];
  onPlayAgain: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  score,
  vouchers,
  onPlayAgain,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const isTier2 = vouchers.length >= 2;
  const totalLiters = vouchers.reduce((acc, v) => acc + v.liters, 0);

  // Expiry countdown timer (typically 15 mins)
  useEffect(() => {
    if (vouchers.length === 0) return;
    const expiresAt = vouchers[0].expiresAt;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [vouchers]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {});
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 sm:p-6 text-center my-auto flex flex-col items-center">
        {/* Celebration Trophy / Ribbon */}
        <div className="relative mb-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
            <Award className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#E31837] text-white font-extrabold text-[11px] shadow-md border border-red-400">
            {score} Điểm
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
          CHÚC MỪNG BẠN!
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-amber-300 mt-0.5 mb-3">
          {isTier2
            ? '🏆 Bạn đã mở khóa mốc cao nhất: 02 Voucher 2L (Tổng 4 Lít Xăng)!'
            : '🎉 Bạn đã xuất sắc nhận được 01 Voucher 2 Lít Xăng!'}
        </p>

        {/* Voucher Cards list */}
        <div className="w-full flex flex-col gap-3 mb-4">
          {vouchers.map((v, idx) => (
            <div
              key={v.code}
              className="w-full rounded-2xl bg-gradient-to-b from-white to-slate-50 text-slate-900 p-3.5 shadow-lg border border-slate-200 flex flex-col gap-2 relative overflow-hidden"
            >
              {/* VietinBank Branded Top Stripe */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0054A6] via-[#0072CE] to-[#E31837]" />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#0054A6] text-white flex items-center justify-center font-black text-[10px]">
                    V
                  </div>
                  <span className="font-extrabold text-xs text-[#0054A6] tracking-tight">
                    VIETINBANK VOUCHER #{idx + 1}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#E31837] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {v.liters} Lít Xăng
                </span>
              </div>

              {/* QR Code and Code Details */}
              <div className="flex items-center gap-3 bg-slate-100/80 p-2 rounded-xl border border-slate-200">
                {/* Embedded Scannable QR Code */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white p-1 rounded-lg shadow-sm border border-slate-300 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: renderQRCodeSVG(v.code, 90),
                  }}
                />

                <div className="flex flex-col items-start justify-center flex-1 min-w-0">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Mã xác nhận tại quầy:
                  </span>
                  <div className="font-mono font-black text-sm sm:text-base text-slate-900 tracking-wider truncate w-full text-left my-0.5">
                    {v.code}
                  </div>

                  <div className="text-[10px] text-slate-600 truncate max-w-full text-left">
                    Khách: <strong>{v.customerNumber}</strong> · {v.branchName}
                  </div>

                  <button
                    onClick={() => copyToClipboard(v.code)}
                    className="mt-1 px-2.5 py-1 rounded-md bg-[#0054A6] hover:bg-[#004080] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 active:scale-95"
                  >
                    {copiedCode === v.code ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Sao chép mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counter Expiry Countdown Warning */}
        <div className="w-full px-3 py-2.5 rounded-xl bg-amber-950/70 border border-amber-600/60 text-xs text-amber-200 flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-left">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-white">Hiệu lực nhận quà tại quầy:</div>
              <div className="text-[10px] text-amber-300/80">
                Xuất trình cho Giao dịch viên trước khi hết giờ
              </div>
            </div>
          </div>
          <span className="font-mono font-black text-base text-amber-300 px-2 py-0.5 rounded bg-black/40 border border-amber-500/40">
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Instruction Note */}
        <div className="text-[11px] text-slate-300 mb-4 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-left flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Quý khách vui lòng đưa trực tiếp màn hình mã QR hoặc đọc mã cho Giao dịch viên VietinBank tại quầy để nhận phiếu xăng.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0054A6] to-[#0072CE] hover:from-[#004080] hover:to-[#005faa] text-white font-bold text-sm shadow-lg shadow-sky-950/40 transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lượt Mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};

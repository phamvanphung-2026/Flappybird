import React from 'react';
import { X, Fuel, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-6 text-slate-200 my-auto flex flex-col relative max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#0054A6] flex items-center justify-center text-white font-black text-sm">
            V
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans">
              Thể Lệ Chương Trình
            </h3>
            <p className="text-xs text-sky-400">
              "Bay Cùng VietinBank - Săn Voucher Xăng Vàng"
            </p>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* Section 1: Đối tượng áp dụng */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Đối tượng tham gia</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Tất cả quý khách hàng đang có mặt tại quầy giao dịch VietinBank, đã lấy số thứ tự hoặc đang chờ phục vụ tại các quầy nghiệp vụ.
            </p>
          </div>

          {/* Section 2: Cơ cấu giải thưởng */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>2. Cơ cấu giải thưởng</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-700/50">
                <Fuel className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Mốc 1 (Từ 30 đến 49 điểm):</div>
                  <div className="text-sky-300 font-semibold text-xs">Tặng 01 Voucher 2 Lít Xăng</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Áp dụng tại chuỗi cây xăng Petrolimex / PVOIL toàn quốc.</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-amber-500/40">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300 text-xs">Mốc 2 (Từ 50 điểm trở lên):</div>
                  <div className="text-amber-200 font-bold text-xs">Tặng 02 Voucher 2 Lít Xăng (Tổng 4 Lít Xăng)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mức thưởng cao nhất dành cho người chơi xuất sắc nhất.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Quy định đổi thưởng */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>3. Quy định đổi quà tại quầy</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
              <li>Màn hình trả thưởng có mã QR và đồng hồ đếm ngược 15 phút.</li>
              <li>Quý khách xuất trình màn hình thiết bị hoặc đọc mã cho Giao dịch viên tại quầy.</li>
              <li>Mỗi số phiếu thứ tự được nhận tối đa 01 phần quà theo mốc điểm cao nhất đạt được trong lượt chờ.</li>
              <li>Quà tặng voucher xăng không có giá trị quy đổi thành tiền mặt.</li>
            </ul>
          </div>
        </div>

        {/* Confirm button */}
        <div className="pt-4 border-t border-slate-800 mt-3">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0054A6] to-[#0072CE] hover:from-[#004080] hover:to-[#005faa] text-white font-bold text-sm shadow-md transition-colors"
          >
            ĐÃ HIỂU VÀ TIẾP TỤC
          </button>
        </div>
      </div>
    </div>
  );
};

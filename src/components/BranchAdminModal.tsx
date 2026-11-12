import React, { useState } from 'react';
import { X, Save, RotateCcw, Trash2, ListFilter, Sliders, Database, Check, Download } from 'lucide-react';
import { GameSettings, ScoreHistoryItem } from '../types/game';
import { clearHistory, loadHistory, saveBestScore } from '../utils/storage';

interface BranchAdminModalProps {
  settings: GameSettings;
  onSaveSettings: (settings: GameSettings) => void;
  onClose: () => void;
  onResetBestScore: () => void;
}

export const BranchAdminModal: React.FC<BranchAdminModalProps> = ({
  settings,
  onSaveSettings,
  onClose,
  onResetBestScore,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');
  const [branchName, setBranchName] = useState(settings.branchName);
  const [customerNumber, setCustomerNumber] = useState(settings.customerNumber);
  const [difficulty, setDifficulty] = useState(settings.difficulty);
  const [counterDuration, setCounterDuration] = useState(settings.counterDurationMinutes);
  const [vouchersText, setVouchersText] = useState(settings.customVouchersPool.join('\n'));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [historyList, setHistoryList] = useState<ScoreHistoryItem[]>(loadHistory());

  const handleSave = () => {
    const customPool = vouchersText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated: GameSettings = {
      ...settings,
      branchName,
      customerNumber,
      difficulty,
      counterDurationMinutes: Number(counterDuration) || 15,
      customVouchersPool: customPool,
    };

    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử trả thưởng tại quầy này?')) {
      clearHistory();
      setHistoryList([]);
    }
  };

  const handleExportCSV = () => {
    if (historyList.length === 0) return;
    const header = 'Thời gian,Số phiếu,Chi nhánh,Điểm số,Hạng thưởng,Số voucher,Mã voucher\n';
    const rows = historyList.map((h) => {
      const timeStr = new Date(h.timestamp).toLocaleString('vi-VN');
      return `"${timeStr}","${h.customerNumber}","${h.branchName}","${h.score}","${h.rewardTier}","${h.voucherCount}","${h.voucherCodes.join(';')}"`;
    }).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VTB_Vouchers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-6 text-slate-200 my-auto flex flex-col relative max-h-[90vh]">
        {/* Close button */}
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
            ⚙️
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans">
              Cấu Hình Quầy Giao Dịch
            </h3>
            <p className="text-xs text-sky-400">
              Dành riêng cho nhân viên & giao dịch viên VietinBank
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl mb-4 border border-slate-700">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'config'
                ? 'bg-[#0054A6] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Thông Số Quầy</span>
          </button>
          <button
            onClick={() => {
              setHistoryList(loadHistory());
              setActiveTab('history');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'history'
                ? 'bg-[#0054A6] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Lịch Sử Cấp Voucher ({historyList.length})</span>
          </button>
        </div>

        {/* Tab 1: Config */}
        {activeTab === 'config' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {/* Branch Name */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tên Chi Nhánh / Phòng Giao Dịch:
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                placeholder="VD: Chi nhánh Hoàn Kiếm - Hà Nội"
              />
            </div>

            {/* Customer Ticket Number */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Số Phiếu Khách Hàng:
                </label>
                <input
                  type="text"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-sky-400"
                  placeholder="VD: A-028"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Thời hạn mã (phút):
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={counterDuration}
                  onChange={(e) => setCounterDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Mức Độ Trải Nghiệm (Khoảng cách cột):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'normal', 'hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 rounded-xl border text-center font-semibold capitalize transition-all ${
                      difficulty === lvl
                        ? 'bg-sky-950 border-sky-400 text-sky-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'easy' ? 'Dễ (Khách lớn tuổi)' : lvl === 'normal' ? 'Bình thường' : 'Thử thách'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Vouchers Pool */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  Kho Mã Voucher Thực Tế (Tùy chọn):
                </label>
                <span className="text-[11px] text-slate-400">
                  {vouchersText.split('\n').filter((s) => s.trim().length > 0).length} mã sẵn sàng
                </span>
              </div>
              <textarea
                rows={3}
                value={vouchersText}
                onChange={(e) => setVouchersText(e.target.value)}
                placeholder="Nhập mỗi mã voucher trên 1 dòng (ví dụ: VTB-PETRO-998811). Nếu để trống, hệ thống sẽ tự sinh mã chuẩn VTB-XANG2L-XXXXXX."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            {/* Reset Best score */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Kỷ lục điểm số thiết bị:</span>
              <button
                type="button"
                onClick={onResetBestScore}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại kỷ lục (0)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: History */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">
                Tổng cộng: <strong className="text-white">{historyList.length}</strong> lượt đạt thưởng
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={historyList.length === 0}
                  className="px-2.5 py-1 rounded-lg bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700 flex items-center gap-1 disabled:opacity-40"
                >
                  <Download className="w-3 h-3" />
                  <span>Xuất CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  disabled={historyList.length === 0}
                  className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 flex items-center gap-1 disabled:opacity-40"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            {historyList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-800/40 rounded-2xl border border-slate-800">
                Chưa có dữ liệu trúng thưởng nào được ghi nhận hôm nay.
              </div>
            ) : (
              historyList.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-white">
                      <span className="font-bold text-amber-400">{item.customerNumber}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold">{item.score} điểm</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-sky-300 font-semibold">
                        {item.voucherCount} voucher ({item.voucherCount * 2}L)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.timestamp).toLocaleTimeString('vi-VN')} · {item.voucherCodes.join(', ')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer Save */}
        {activeTab === 'config' && (
          <div className="pt-3 border-t border-slate-800 mt-2 flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0054A6] to-[#0072CE] hover:from-[#004080] hover:to-[#005faa] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU CẤU HÌNH</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

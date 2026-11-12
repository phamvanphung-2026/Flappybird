import { GameSettings, RewardTier, ScoreHistoryItem, Voucher } from '../types/game';

const SETTINGS_KEY = 'vtb_flappy_settings_v1';
const BEST_SCORE_KEY = 'vtb_flappy_best_score_v1';
const HISTORY_KEY = 'vtb_flappy_voucher_history_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  difficulty: 'normal',
  customerNumber: 'A-028',
  branchName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
  counterDurationMinutes: 15,
  customVouchersPool: [],
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function loadBestScore(): number {
  try {
    const val = localStorage.getItem(BEST_SCORE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number) {
  try {
    const current = loadBestScore();
    if (score > current) {
      localStorage.setItem(BEST_SCORE_KEY, score.toString());
      return score;
    }
    return current;
  } catch {
    return score;
  }
}

export function loadHistory(): ScoreHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordHistoryItem(item: ScoreHistoryItem) {
  try {
    const list = loadHistory();
    list.unshift(item);
    // Keep last 100 items
    if (list.length > 100) list.length = 100;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

// Generate realistic VietinBank fuel voucher
export function issueVouchers(
  tier: RewardTier,
  settings: GameSettings
): Voucher[] {
  if (tier === 0) return [];

  const now = Date.now();
  const expiresAt = now + settings.counterDurationMinutes * 60 * 1000;
  const quantity = tier === 1 ? 1 : 2;
  const vouchers: Voucher[] = [];

  for (let i = 0; i < quantity; i++) {
    let code = '';
    // Check if custom vouchers pool has available code
    if (settings.customVouchersPool && settings.customVouchersPool.length > 0) {
      code = settings.customVouchersPool.shift()!;
      saveSettings(settings); // update pool
    } else {
      // Auto-generate standard code: VTB-XANG2L-XXXXXX
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randomPart = '';
      for (let c = 0; c < 6; c++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code = `VTB-XANG2L-${randomPart}`;
    }

    vouchers.push({
      code,
      liters: 2,
      quantity: 1,
      issuedAt: now,
      expiresAt,
      customerNumber: settings.customerNumber,
      branchName: settings.branchName,
    });
  }

  return vouchers;
}

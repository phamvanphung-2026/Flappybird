export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'REWARD';

export type RewardTier = 0 | 1 | 2; // 0: <30 (no prize), 1: 30..49 (1 voucher 2L), 2: >=50 (2 vouchers 2L)

export interface Voucher {
  code: string;
  liters: number; // 2 or 4
  quantity: number; // 1 or 2
  issuedAt: number;
  expiresAt: number;
  customerNumber: string;
  branchName: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  customerNumber: string;
  branchName: string;
  counterDurationMinutes: number;
  customVouchersPool: string[]; // pre-loaded by teller
}

export interface ScoreHistoryItem {
  id: string;
  score: number;
  rewardTier: RewardTier;
  voucherCount: number;
  voucherCodes: string[];
  customerNumber: string;
  branchName: string;
  timestamp: number;
}

export interface BirdState {
  x: number;
  y: number;
  vy: number;
  radius: number;
  width: number;
  height: number;
  rotation: number;
  wingAngle: number;
  isFlapping: boolean;
}

export interface PipeState {
  x: number;
  topHeight: number;
  gap: number;
  width: number;
  passed: boolean;
  scored: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  tier: 1 | 2;
  timestamp: number;
}

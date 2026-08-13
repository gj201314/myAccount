// EXPORTS: IRecord, RecordType, ChannelType, STORAGE_KEY, THEME_KEY, loadRecords, saveRecords

import { scopedStorage } from '@lark-apaas/client-toolkit-lite';

export type RecordType = 'lend' | 'borrow' | 'return';
export type ChannelType = '微信' | '支付宝' | '银行卡';

export interface IRecord {
  id: string;
  name: string;
  tradeDate: string;
  money: number;
  type: RecordType;
  channel: ChannelType;
  repayDate?: string;
  note?: string;
  isDone: boolean;
}

export const STORAGE_KEY = 'borrow_ledger_v2';
export const THEME_KEY = 'ledger_dark_v2';

export function loadRecords(): IRecord[] {
  try {
    const raw = scopedStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as IRecord[];
    return [];
  } catch {
    return [];
  }
}

export function saveRecords(records: IRecord[]): void {
  scopedStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getTypeLabel(type: RecordType): string {
  const map: Record<RecordType, string> = {
    lend: '借出',
    borrow: '借入',
    return: '归还',
  };
  return map[type];
}

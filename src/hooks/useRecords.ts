import { useState, useEffect, useCallback } from 'react';
import { loadRecords, saveRecords, type IRecord } from '@/data/record';

export function useRecords() {
  const [records, setRecords] = useState<IRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const updateRecords = useCallback((next: IRecord[]) => {
    setRecords(next);
    saveRecords(next);
  }, []);

  const addRecord = useCallback((record: Omit<IRecord, 'id'>) => {
    const newRecord: IRecord = {
      ...record,
      id: String(Date.now()),
    };
    setRecords(prev => {
      const next = [...prev, newRecord];
      saveRecords(next);
      return next;
    });
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<IRecord>) => {
    setRecords(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, ...updates } : r));
      saveRecords(next);
      return next;
    });
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => {
      const next = prev.filter(r => r.id !== id);
      saveRecords(next);
      return next;
    });
  }, []);

  const replaceAll = useCallback((newRecords: IRecord[]) => {
    updateRecords(newRecords);
  }, [updateRecords]);

  // 统计：总借出金额
  const totalLend = records.reduce((sum, r) => {
    if (r.type === 'lend') return sum + r.money;
    return sum;
  }, 0);

  // 统计：已收回金额
  const totalRecovered = records.reduce((sum, r) => {
    if (r.type === 'lend') return sum + r.money;
    return sum;
  }, 0);

  // 统计：总归还金额（return 类型，即他人归还的金额）
  const totalReturn = records.reduce((sum, r) => {
    if (r.type === 'return') return sum + r.money;
    return sum;
  }, 0);

  // 统计：待收回金额
  const totalPending = (totalLend - totalReturn);

  // 按人员汇总
  const personSummary = (() => {
    const map = new Map<string, { name: string; totalLend: number; totalReturn: number; totalPending: number }>();
    for (const r of records) {
      if (!map.has(r.name)) {
        map.set(r.name, { name: r.name, totalLend: 0, totalReturn: 0, totalPending: 0 });
      }
      const p = map.get(r.name)!;
      if (r.type === 'lend') {
        p.totalLend += r.money;
      }
      if (r.type === 'return') {
        // 归还减少待收回
        p.totalReturn = p.totalReturn + r.money;
      }
      p.totalPending = p.totalLend - p.totalReturn;
    }
    return Array.from(map.values()).sort((a, b) => b.totalPending - a.totalPending);
  })();

  // 近 6 个月每月借出/归还金额
  const monthlyTrend = (() => {
    const result: { month: string; lend: number; return_: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      result.push({ month: monthKey, lend: 0, return_: 0 });
    }

    for (const r of records) {
      const month = r.tradeDate.slice(0, 7);
      const item = result.find(x => x.month === month);
      if (!item) continue;
      if (r.type === 'lend') item.lend += r.money;
      if (r.type === 'return') item.return_ += r.money;
    }

    return result;
  })();

  return {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    replaceAll,
    totalLend,
    totalPending,
    totalRecovered,
    totalReturn,
    personSummary,
    monthlyTrend,
  };
}

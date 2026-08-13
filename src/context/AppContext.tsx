import { createContext, useContext, memo, type ReactNode } from 'react';
import { useRecords } from '@/hooks/useRecords';
import { useTheme } from '@/hooks/useTheme';
import type { IRecord } from '@/data/record';

interface AppContextValue {
  records: IRecord[];
  addRecord: (record: Omit<IRecord, 'id'>) => IRecord;
  updateRecord: (id: string, updates: Partial<IRecord>) => void;
  deleteRecord: (id: string) => void;
  markDone: (id: string) => void;
  replaceAll: (records: IRecord[]) => void;
  totalLend: number;
  totalPending: number;
  totalRecovered: number;
  totalReturn: number;
  personSummary: { name: string; totalLend: number; totalPending: number }[];
  monthlyTrend: { month: string; lend: number; return_: number }[];
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppProviderInner({ children }: { children: ReactNode }) {
  const recordsApi = useRecords();
  const themeApi = useTheme();

  const value: AppContextValue = {
    ...recordsApi,
    ...themeApi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const AppProvider = memo(AppProviderInner);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

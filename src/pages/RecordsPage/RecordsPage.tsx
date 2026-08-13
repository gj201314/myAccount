import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ChevronRight, UserRound } from 'lucide-react';

export default function RecordsPage() {
  const navigate = useNavigate();
  const { personSummary, totalLend, totalPending } = useApp();

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="pt-2 text-2xl font-bold">记录</h1>

      {/* 顶部统计栏 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="grid grid-cols-3 text-center">
          <div>
            <div className="text-xs text-muted-foreground">往来人员</div>
            <div className="mt-1 text-xl font-bold">{personSummary.length}</div>
          </div>
          <div className="border-x border-border">
            <div className="text-xs text-muted-foreground">总借出</div>
            <div className="mt-1 text-xl font-bold">¥{totalLend.toFixed(0)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">待收回</div>
            <div className="mt-1 text-xl font-bold text-[#f53f3f]">¥{totalPending.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* 人员列表 */}
      <div className="space-y-3 pb-4">
        {personSummary.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center shadow-sm">
            <div className="text-sm text-muted-foreground">暂无往来人员</div>
            <div className="mt-2 text-xs text-muted-foreground">前往设置添加新账目记录</div>
          </div>
        ) : (
          personSummary.map(person => (
            <button
              key={person.name}
              onClick={() => navigate(`/person/${encodeURIComponent(person.name)}`)}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm transition-opacity active:opacity-70"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{person.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  总借出 ¥{person.totalLend.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">待收回</div>
                <div className="text-base font-bold text-[#f53f3f]">
                  ¥{person.totalPending.toFixed(2)}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

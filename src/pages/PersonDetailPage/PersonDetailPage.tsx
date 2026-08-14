import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { getTypeLabel, type IRecord, type RecordType } from '@/data/record';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

const TYPE_COLORS: Record<RecordType, { bg: string; text: string }> = {
  lend: { bg: 'bg-[#f53f3f]/10', text: 'text-[#f53f3f]' },
  borrow: { bg: 'bg-[#722ed1]/10', text: 'text-[#722ed1]' },
  return: { bg: 'bg-[#00b42a]/10', text: 'text-[#00b42a]' },
};

function isOverdue(repayDate: string | undefined): boolean {
  if (!repayDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return repayDate < today;
}

export default function PersonDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { records, deleteRecord } = useApp();

  const personName = name ? decodeURIComponent(name) : '';
  const personRecords = records
    .filter(r => r.name === personName)
    .sort((a, b) => b.tradeDate.localeCompare(a.tradeDate));

  const totalLend = personRecords.reduce((sum, r) => {
    if (r.type === 'lend') return sum + r.money;
    return sum;
  }, 0);

  const totalPending = personRecords.reduce((sum, r) => {
    if (r.type === 'lend') return sum + r.money;
    if (r.type === 'return') return sum - r.money;
    return sum;
  }, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      deleteRecord(id);
      alert('删除成功');
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader title={personName} />

      <div className="space-y-4 px-4 py-4">
        {/* 小计卡片 */}
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-muted-foreground">总借出金额</div>
              <div className="mt-1 text-xl font-bold">¥{totalLend.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">待收回金额</div>
              <div className="mt-1 text-xl font-bold text-[#f53f3f]">
                ¥{Math.max(0, totalPending).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 记录列表 */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">往来记录（{personRecords.length}条）</h2>

          {personRecords.length === 0 ? (
            <div className="rounded-2xl bg-card p-8 text-center shadow-sm">
              <div className="text-sm text-muted-foreground">暂无记录</div>
            </div>
          ) : (
            personRecords.map((record: IRecord) => {
              const color = TYPE_COLORS[record.type];
              const overdue = record.type === 'lend' && isOverdue(record.repayDate);

              return (
                <div key={record.id} className="rounded-2xl bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}>
                          {getTypeLabel(record.type)}
                        </span>
                        {overdue && (
                          <span className="inline-flex items-center rounded-full bg-[#f53f3f]/10 px-2 py-0.5 text-xs font-medium text-[#f53f3f]">
                            已逾期
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xl font-bold text-foreground">
                        ¥{record.money.toFixed(2)}
                      </div>
                      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        <div>交易日期：{record.tradeDate}</div>
                        <div>支付渠道：{record.channel}</div>
                        {record.repayDate && <div>约定还款日：{record.repayDate}</div>}
                        {record.note && <div>备注：{record.note}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2 border-t border-border/60 pt-3">
                    <button
                      onClick={() => navigate(`/edit/${record.id}`)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-muted py-2.5 text-sm font-medium text-foreground transition-opacity active:opacity-60"
                    >
                      <Pencil className="h-4 w-4" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#f53f3f]/10 py-2.5 text-sm font-medium text-[#f53f3f] transition-opacity active:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

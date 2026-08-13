import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import PageHeader from '@/components/PageHeader';
import { numberToChinese } from '@/lib/currency';
import type { RecordType, ChannelType } from '@/data/record';

const TYPES: { value: RecordType; label: string; color: string }[] = [
  { value: 'lend', label: '借出', color: '#f53f3f' },
  { value: 'borrow', label: '借入', color: '#722ed1' },
  { value: 'return', label: '归还', color: '#00b42a' },
];

const CHANNELS: ChannelType[] = ['微信', '支付宝', '银行卡'];

export default function EditRecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, updateRecord } = useApp();

  const record = records.find(r => r.id === id);

  const [name, setName] = useState(record?.name ?? '');
  const [tradeDate, setTradeDate] = useState(record?.tradeDate ?? '');
  const [money, setMoney] = useState(record ? String(record.money) : '');
  const [type, setType] = useState<RecordType>(record?.type ?? 'lend');
  const [channel, setChannel] = useState<ChannelType>(record?.channel ?? '微信');
  const [repayDate, setRepayDate] = useState(record?.repayDate ?? '');
  const [note, setNote] = useState(record?.note ?? '');
  const [isDone, setIsDone] = useState(record?.isDone ?? false);

  // id 变化时重新加载（虽然 id 不变，但保险）
  useEffect(() => {
    if (record) {
      setName(record.name);
      setTradeDate(record.tradeDate);
      setMoney(String(record.money));
      setType(record.type);
      setChannel(record.channel);
      setRepayDate(record.repayDate ?? '');
      setNote(record.note ?? '');
      setIsDone(record.isDone);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const moneyNum = parseFloat(money) || 0;
  const chineseAmount = useMemo(
    () => (moneyNum > 0 ? numberToChinese(moneyNum) : ''),
    [moneyNum]
  );

  const handleSubmit = () => {
    if (!id || !record) return;
    const errors: string[] = [];
    if (!name.trim()) errors.push('姓名不能为空');
    if (!tradeDate) errors.push('交易日期不能为空');
    if (!money || moneyNum <= 0) errors.push('金额必须大于0');
    if (!channel) errors.push('请选择支付渠道');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    updateRecord(id, {
      name: name.trim(),
      tradeDate,
      money: moneyNum,
      type,
      channel,
      repayDate: type === 'lend' ? repayDate || undefined : undefined,
      note: note.trim() || undefined,
      isDone,
    });

    alert('保存成功');
    navigate(`/person/${encodeURIComponent(name.trim())}`);
  };

  if (!record) {
    return (
      <div className="min-h-screen">
        <PageHeader title="编辑账目" />
        <div className="p-8 text-center text-muted-foreground">未找到该记录</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="编辑账目" />

      <div className="space-y-4 px-4 py-4">
        {/* 姓名 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            对方姓名 <span className="text-[#f53f3f]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入对方姓名"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* 交易日期 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            交易日期 <span className="text-[#f53f3f]">*</span>
          </label>
          <input
            type="date"
            value={tradeDate}
            onChange={e => setTradeDate(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        {/* 金额 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            金额 <span className="text-[#f53f3f]">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={money}
            onChange={e => setMoney(e.target.value)}
            placeholder="请输入金额"
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
          {chineseAmount && (
            <div className="mt-1.5 text-xs text-muted-foreground">{chineseAmount}</div>
          )}
        </div>

        {/* 账目类型 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">账目类型</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map(t => {
              const active = type === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  style={active ? { borderColor: t.color, color: t.color, backgroundColor: `${t.color}15` } : undefined}
                  className={`h-12 rounded-xl border border-input bg-background text-sm font-medium transition-all active:opacity-70 ${
                    active ? '' : 'text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 支付渠道 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            支付渠道 <span className="text-[#f53f3f]">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CHANNELS.map(c => {
              const active = channel === c;
              return (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`h-12 rounded-xl border text-sm font-medium transition-all active:opacity-70 ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background text-foreground'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* 约定还款日（仅借出） */}
        {type === 'lend' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              约定还款日 <span className="text-muted-foreground text-xs">（选填）</span>
            </label>
            <input
              type="date"
              value={repayDate}
              onChange={e => setRepayDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
        )}

        {/* 是否结清 */}
        {type === 'lend' && (
          <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 shadow-sm">
            <span className="text-sm font-medium text-foreground">是否已结清</span>
            <button
              onClick={() => setIsDone(!isDone)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isDone ? 'bg-[#00b42a]' : 'bg-muted'
              }`}
              aria-label="切换结清状态"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isDone ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        )}

        {/* 备注 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">备注说明</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="选填，记录备注信息"
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur-md pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md">
          <button
            onClick={handleSubmit}
            className="h-12 w-full rounded-xl bg-primary text-base font-medium text-primary-foreground transition-opacity active:opacity-80"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

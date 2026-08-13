import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface FieldErrors {
  name?: boolean;
  tradeDate?: boolean;
  money?: boolean;
  channel?: boolean;
}

export default function AddRecordPage() {
  const navigate = useNavigate();
  const { addRecord } = useApp();

  const [name, setName] = useState('');
  const [tradeDate, setTradeDate] = useState(todayStr());
  const [money, setMoney] = useState('');
  const [type, setType] = useState<RecordType>('lend');
  const [channel, setChannel] = useState<ChannelType>('微信');
  const [repayDate, setRepayDate] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const moneyNum = parseFloat(money) || 0;
  const chineseAmount = useMemo(
    () => (moneyNum > 0 ? numberToChinese(moneyNum) : ''),
    [moneyNum]
  );

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const messages: string[] = [];

    if (!name.trim()) {
      next.name = true;
      messages.push('对方姓名不能为空');
    }
    if (!tradeDate) {
      next.tradeDate = true;
      messages.push('交易日期不能为空');
    }
    if (!money || moneyNum <= 0) {
      next.money = true;
      messages.push('金额必须大于0');
    }
    if (!channel) {
      next.channel = true;
      messages.push('请选择支付渠道');
    }

    setErrors(next);

    if (messages.length > 0) {
      alert(messages.join('\n'));
      return false;
    }
    return true;
  };

  const handleSubmit = (code: number) => {
    if (!validate()) return;

    addRecord({
      name: name.trim(),
      tradeDate,
      money: moneyNum,
      type,
      channel,
      repayDate: type === 'lend' ? repayDate || undefined : undefined,
      note: note.trim() || undefined,
      isDone: type === 'lend' ? false : true,
    });

    alert('添加成功');
    if(code === 1) {
      navigate('/settings');
    }else{
      setMoney("");
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="添加账目" />

      <div className="space-y-4 px-4 py-4">
        {/* 对方姓名 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            对方姓名 <span className="text-[#f53f3f]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: false }));
            }}
            placeholder="请输入对方姓名"
            className={`h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
              errors.name ? 'border-[#f53f3f]' : 'border-input'
            }`}
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
            onChange={e => {
              setTradeDate(e.target.value);
              if (errors.tradeDate) setErrors(prev => ({ ...prev, tradeDate: false }));
            }}
            className={`h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${
              errors.tradeDate ? 'border-[#f53f3f]' : 'border-input'
            }`}
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
            onChange={e => {
              setMoney(e.target.value);
              if (errors.money) setErrors(prev => ({ ...prev, money: false }));
            }}
            placeholder="请输入金额"
            className={`h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${
              errors.money ? 'border-[#f53f3f]' : 'border-input'
            }`}
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
                  onClick={() => {
                    setChannel(c);
                    if (errors.channel) setErrors(prev => ({ ...prev, channel: false }));
                  }}
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

      {/* 底部提交按钮 */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur-md pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md flex">
          <button
            onClick={()=>handleSubmit(1)}
            className="h-12 w-full rounded-xl bg-primary text-base font-medium text-primary-foreground transition-opacity active:opacity-80"
            style={{ width: '45%' }}
          >
            提交
          </button>
          <button
            onClick={() => handleSubmit(2)}
            className="h-12 w-full rounded-xl bg-success text-base font-medium text-primary-foreground transition-opacity active:opacity-80"
            style={{ width: '45%',marginLeft: '10%' }}
          >
            再次编辑
          </button>
        </div>
      </div>
    </div>
  );
}

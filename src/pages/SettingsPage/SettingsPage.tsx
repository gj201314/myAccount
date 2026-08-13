import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { exportToCSV, importFromCSV } from '@/lib/csv';
import { Plus, Download, Upload, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { records, replaceAll, isDark, toggleTheme } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const csv = exportToCSV(records);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `借还记账_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('导出成功');
    } catch (e) {
      alert('导出失败');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = importFromCSV(text);
      if (imported.length === 0) {
        alert('文件格式错误或无数据');
        return;
      }
      replaceAll(imported);
      alert(`导入成功，共 ${imported.length} 条记录`);
    } catch {
      alert('导入失败，文件格式错误');
    } finally {
      // 重置 input 以便重复选择同一文件
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="pt-2 text-2xl font-bold">设置</h1>

      <div className="space-y-2 rounded-2xl bg-card p-2 shadow-sm">
        <button
          onClick={() => navigate('/add')}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Plus className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="font-medium">添加新账目记录</div>
            <div className="text-xs text-muted-foreground">新建一条借出/借入/归还记录</div>
          </div>
        </button>
      </div>

      <div className="space-y-2 rounded-2xl bg-card p-2 shadow-sm">
        <button
          onClick={handleExport}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-[#00b42a]">
            <Download className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="font-medium">导出CSV备份文件</div>
            <div className="text-xs text-muted-foreground">将所有账目导出为CSV格式备份</div>
          </div>
        </button>

        <div className="h-px bg-border/60" />

        <button
          onClick={handleImportClick}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#722ed1]/10 text-[#722ed1]">
            <Upload className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="font-medium">导入CSV恢复数据</div>
            <div className="text-xs text-muted-foreground">从CSV文件恢复全部账目数据</div>
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-2 rounded-2xl bg-card p-2 shadow-sm">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-opacity active:opacity-70"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
            {isDark ? (
              <Sun className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={2} />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{isDark ? '切换到浅色模式' : '切换到深色模式'}</div>
            <div className="text-xs text-muted-foreground">
              当前：{isDark ? '深色模式' : '浅色模式'}
            </div>
          </div>
        </button>
      </div>

      <div className="pb-8 text-center text-xs text-muted-foreground">
        个人借还记账 v1.0 · 本地安全存储
      </div>
    </div>
  );
}

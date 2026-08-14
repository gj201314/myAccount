// EXPORTS: exportToCSV, importFromCSV

import type { IRecord, RecordType, ChannelType } from '@/data/record';

const CSV_HEADERS = [
  'ID', '姓名', '交易日期', '金额', '类型', '支付渠道', '约定还款日', '备注',
];

function escapeCSV(value: string | number | boolean | undefined): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

export function exportToCSV(records: IRecord[]): string {
  const rows: string[] = [];
  rows.push(CSV_HEADERS.join(','));

  for (const r of records) {
    const typeMap: Record<RecordType, string> = { lend: '借出', borrow: '借入', return: '归还' };
    rows.push([
      escapeCSV(r.id),
      escapeCSV(r.name),
      escapeCSV(r.tradeDate),
      escapeCSV(r.money),
      escapeCSV(typeMap[r.type]),
      escapeCSV(r.channel),
      escapeCSV(r.repayDate ?? ''),
      escapeCSV(r.note ?? ''),
    ].join(','));
  }

  // 加 BOM 以便 Excel 正确识别中文
  return '\uFEFF' + rows.join('\n');
}

export function importFromCSV(csvText: string): IRecord[] {
  // 去掉 BOM
  const text = csvText.startsWith('\uFEFF') ? csvText.slice(1) : csvText;
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) return [];

  // 跳过表头
  const typeReverse: Record<string, RecordType> = { '借出': 'lend', '借入': 'borrow', '归还': 'return', lend: 'lend', borrow: 'borrow', return: 'return' };
  const channelValues: ChannelType[] = ['微信', '支付宝', '银行卡'];

  const records: IRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 6) continue;

    const [id, name, tradeDate, moneyStr, typeStr, channel, repayDate, note] = cols;

    const type = typeReverse[typeStr] ?? 'lend';
    const money = parseFloat(moneyStr) || 0;

    records.push({
      id: id || String(Date.now() + i),
      name: name || '',
      tradeDate: tradeDate || new Date().toISOString().slice(0, 10),
      money,
      type,
      channel: (channelValues.includes(channel as ChannelType) ? channel : '微信') as ChannelType,
      repayDate: repayDate || undefined,
      note: note || undefined
    });
  }

  return records;
}

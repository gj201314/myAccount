import { useApp } from '@/context/AppContext';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const COLOR_LEND = '#f53f3f';
const COLOR_RECOVERED = '#00b42a';

export default function StatsPage() {
  const { totalLend, totalPending, totalRecovered, monthlyTrend, isDark } = useApp();

  const doughnutOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const p = params as { name: string; value: number; percent: number };
        return `${p.name}<br/>金额：¥${p.value.toFixed(2)}<br/>占比：${p.percent}%`;
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      icon: 'circle',
      textStyle: { color: isDark ? '#cbd5e1' : '#475569', fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        data: [
          { value: Number(totalPending.toFixed(2)), name: '待收回', itemStyle: { color: COLOR_LEND } },
          { value: Number(totalRecovered.toFixed(2)), name: '已收回', itemStyle: { color: COLOR_RECOVERED } },
        ],
      },
    ],
  };

  const lineOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const list = Array.isArray(params) ? params : [params];
        const title = list[0]?.axisValue ?? '';
        const lines = list.map(p => {
          const p2 = p as { seriesName: string; value: number; color: string };
          return `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p2.color};margin-right:6px;"></span>${p2.seriesName}：¥${p2.value.toFixed(2)}`;
        });
        return `${title}<br/>${lines.join('<br/>')}`;
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      icon: 'roundRect',
      textStyle: { color: isDark ? '#cbd5e1' : '#475569', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '20%',
      top: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthlyTrend.map(item => item.month.slice(5) + '月'),
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 11,
      },
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#e2e8f0' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 10000) return (value / 10000).toFixed(1) + 'w';
          return String(value);
        },
      },
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
    },
    series: [
      {
        name: '借出',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: COLOR_LEND, width: 2.5 },
        itemStyle: { color: COLOR_LEND },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 63, 63, 0.25)' },
              { offset: 1, color: 'rgba(245, 63, 63, 0.02)' },
            ],
          },
        },
        data: monthlyTrend.map(item => Number(item.lend.toFixed(2))),
      },
      {
        name: '回收',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: COLOR_RECOVERED, width: 2.5 },
        itemStyle: { color: COLOR_RECOVERED },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 180, 42, 0.25)' },
              { offset: 1, color: 'rgba(0, 180, 42, 0.02)' },
            ],
          },
        },
        data: monthlyTrend.map(item => Number(item.return_.toFixed(2))),
      },
    ],
  };

  return (
    <div className="space-y-4 px-4 pt-4">
      <h1 className="pt-2 text-2xl font-bold">统计</h1>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">总借出金额</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            ¥{totalLend.toFixed(2)}
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">待收回欠款</div>
          <div className="mt-2 text-2xl font-bold text-[#f53f3f]">
            ¥{totalPending.toFixed(2)}
          </div>
        </div>
      </div>

      {/* 环形饼图 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-base font-semibold">资金回收分布</h2>
        <ReactECharts option={doughnutOption} className="mt-2 h-[260px] w-full" />
      </div>

      {/* 折线图 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-base font-semibold">近6个月趋势</h2>
        <ReactECharts option={lineOption} className="mt-2 h-[300px] w-full" />
      </div>
    </div>
  );
}

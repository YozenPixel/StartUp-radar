import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FUNDING_DATA = [
  { month: 'Jan 26', amount: 48, label: '48 M€' },
  { month: 'Fév 26', amount: 62, label: '62 M€' },
  { month: 'Mar 26', amount: 95, label: '95 M€' },
  { month: 'Avr 26', amount: 74, label: '74 M€' },
  { month: 'Mai 26', amount: 110, label: '110 M€' },
  { month: 'Juin 26', amount: 145, label: '145 M€' },
  { month: 'Juil 26', amount: 88, label: '88 M€' },
  { month: 'Août 26', amount: 165, label: '165 M€' },
];

export const FundingVolumeChart: React.FC = () => {
  return (
    <div className="h-[260px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={FUNDING_DATA}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            className="text-border/60"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            className="text-muted-foreground"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            className="text-muted-foreground"
            unit=" M€"
          />
          <Tooltip
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {data.month}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {data.amount} M€ levés
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="amount"
            fill="#4F46E5"
            radius={[6, 6, 0, 0]}
            className="transition-all hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

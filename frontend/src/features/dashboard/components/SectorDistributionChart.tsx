import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SECTOR_DATA = [
  { name: 'Artificial Intelligence', value: 42, color: '#4F46E5' },
  { name: 'CleanTech', value: 26, color: '#10B981' },
  { name: 'HealthTech', value: 18, color: '#06B6D4' },
  { name: 'Cybersecurity', value: 14, color: '#8B5CF6' },
  { name: 'Fintech & SaaS', value: 12, color: '#F59E0B' },
];

export const SectorDistributionChart: React.FC = () => {
  return (
    <div className="h-[260px] w-full flex items-center">
      <div className="h-full w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  return (
                    <div className="rounded-xl border border-border bg-card p-2.5 shadow-lg">
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        {data.name}
                      </p>
                      <p className="text-xs font-bold text-foreground">
                        {data.value}% des opportunités
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={SECTOR_DATA}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {SECTOR_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-1/2 space-y-2 pr-2">
        {SECTOR_DATA.map((sec) => (
          <div key={sec.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: sec.color }}
              />
              <span className="truncate text-muted-foreground font-medium">
                {sec.name}
              </span>
            </div>
            <span className="font-bold text-foreground pl-1">
              {sec.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

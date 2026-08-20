import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundingVolumeChart } from './FundingVolumeChart';
import { SectorDistributionChart } from './SectorDistributionChart';
import { TrendUp, ChartPieSlice, Sparkle } from '@phosphor-icons/react';

export const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Graphique 1 : Volume des Levées de Fonds */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <TrendUp size={18} className="text-emerald-500" weight="bold" />
              <CardTitle className="text-base font-bold text-foreground">
                Volume des Levées de Fonds
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Capitaux injectés sur les 8 derniers mois (en Millions d'Euros)
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            +38% vs Q1
          </span>
        </CardHeader>
        <CardContent>
          <FundingVolumeChart />
        </CardContent>
      </Card>

      {/* Graphique 2 : Répartition Sectorielle */}
      <Card className="rounded-2xl border-border bg-card shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ChartPieSlice size={18} className="text-primary" weight="bold" />
              <CardTitle className="text-base font-bold text-foreground">
                Répartition des Signaux par Secteur
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Part relative des opportunités technologiques suivies
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            <Sparkle size={12} weight="fill" />
            IA Dominante
          </span>
        </CardHeader>
        <CardContent>
          <SectorDistributionChart />
        </CardContent>
      </Card>
    </div>
  );
};

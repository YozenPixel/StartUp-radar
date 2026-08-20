import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DashboardMetrics } from '@/features/dashboard/types/startup';
import {
  RocketLaunch,
  CurrencyCircleDollar,
  Sparkle,
  ChartBar,
} from '@phosphor-icons/react';

interface SummaryCardsProps {
  metrics: DashboardMetrics | null;
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, loading = false }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-border/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-28 rounded bg-muted"></div>
              <div className="h-8 w-8 rounded-lg bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-muted mb-2"></div>
              <div className="h-3 w-32 rounded bg-muted/60"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Startups Répertoriées',
      value: metrics.totalStartups.toLocaleString(),
      description: 'Entreprises actives suivies',
      icon: <RocketLaunch size={24} weight="duotone" className="text-blue-500" />,
      gradient: 'from-blue-500/10 to-transparent',
    },
    {
      title: 'Levées de Fonds',
      value: metrics.totalFundingRounds.toLocaleString(),
      description: 'Tours de table tracés',
      icon: <CurrencyCircleDollar size={24} weight="duotone" className="text-emerald-500" />,
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Opportunités Fort Potentiel',
      value: metrics.highPotentialCount.toLocaleString(),
      description: 'Score IA ≥ 7 / 10',
      icon: <Sparkle size={24} weight="duotone" className="text-amber-500" />,
      gradient: 'from-amber-500/10 to-transparent',
    },
    {
      title: 'Score IA Moyen',
      value: `${metrics.averageScore} / 10`,
      description: 'Indice de croissance estimé',
      icon: <ChartBar size={24} weight="duotone" className="text-purple-500" />,
      gradient: 'from-purple-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className={`relative overflow-hidden border border-border/70 bg-gradient-to-br ${card.gradient} transition-all duration-200 hover:shadow-md hover:border-border`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/80 shadow-xs border border-border/50">
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {card.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

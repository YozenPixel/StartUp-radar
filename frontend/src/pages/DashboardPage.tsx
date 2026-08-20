import React, { useState, useEffect } from 'react';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { DashboardCharts } from '@/features/dashboard/components/DashboardCharts';
import { StartupListTable } from '@/features/dashboard/components/StartupListTable';
import { CreateStartupModal } from '@/features/dashboard/components/CreateStartupModal';
import { useDashboardMetrics } from '@/features/dashboard/hooks/useDashboardMetrics';
import { useStartups } from '@/features/dashboard/hooks/useStartups';
import { ArrowsClockwise, Lightning, PlusCircle, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface DashboardPageProps {
  onLiveChange?: (isLive: boolean) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLiveChange }) => {
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Filtres
  const [search, setSearch] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Requêtes TanStack Query
  const { data: metricsResult, isLoading: metricsLoading } = useDashboardMetrics();
  const {
    data: startupsResult,
    isLoading: startupsLoading,
    isFetching,
  } = useStartups({ page, limit: 10, search, sector });

  useEffect(() => {
    if (metricsResult && startupsResult) {
      onLiveChange?.(metricsResult.isLive && startupsResult.isLive);
    }
  }, [metricsResult, startupsResult, onLiveChange]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
    queryClient.invalidateQueries({ queryKey: ['startups'] });
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSectorChange = (newSector: string) => {
    setSector(newSector);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* En-tête du tableau de bord */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tableau de Bord Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Lightning size={12} weight="fill" />
              Live Feed
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Suivi automatisé des startups, analyse des levées de fonds et scoring prédictif des opportunités.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateModalOpen(true)}
            size="sm"
            className="flex items-center gap-1.5 font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle size={16} weight="bold" />
            Ajouter Startup
          </Button>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ArrowsClockwise
              size={14}
              className={isFetching ? 'animate-spin' : ''}
            />
            Actualiser
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <section aria-label="Indicateurs clés">
        <SummaryCards
          metrics={metricsResult?.data || null}
          loading={metricsLoading}
        />
      </section>

      {/* Graphiques Décisionnels Recharts */}
      <section aria-label="Graphiques analytiques">
        <DashboardCharts />
      </section>

      {/* Table interactive des Startups */}
      <section aria-label="Liste des startups" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle size={18} weight="fill" className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Startups & Signaux d'Opportunités
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Trié par pertinence du score IA
          </span>
        </div>

        <StartupListTable
          data={startupsResult?.data || null}
          loading={startupsLoading}
          onSearchChange={handleSearchChange}
          onSectorChange={handleSectorChange}
          onPageChange={setPage}
          currentSearch={search}
          currentSector={sector}
          onDataRefresh={handleRefresh}
        />
      </section>

      {/* Modale de création */}
      <CreateStartupModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

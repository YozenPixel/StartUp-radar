import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { StartupListTable } from '@/features/dashboard/components/StartupListTable';
import { fetchMetrics, fetchStartups } from '@/lib/api';
import {
  DashboardMetrics,
  StartupsResponse,
} from '@/features/dashboard/types/startup';
import { ArrowsClockwise, Lightning, Sparkle } from '@phosphor-icons/react';

export function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [startupsData, setStartupsData] = useState<StartupsResponse | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtres
  const [search, setSearch] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsRes, startupsRes] = await Promise.all([
        fetchMetrics(),
        fetchStartups({ page, limit: 10, search, sector }),
      ]);

      setMetrics(metricsRes.data);
      setStartupsData(startupsRes.data);
      setIsLive(metricsRes.isLive && startupsRes.isLive);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, sector]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSectorChange = (newSector: string) => {
    setSector(newSector);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar isLive={isLive} />

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-8 flex-1">
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
            <button
              onClick={() => loadData()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <ArrowsClockwise
                size={14}
                className={loading ? 'animate-spin' : ''}
              />
              Actualiser
            </button>
          </div>
        </div>

        {/* Cartes KPI */}
        <section aria-label="Indicateurs clés">
          <SummaryCards metrics={metrics} loading={loading} />
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
            data={startupsData}
            loading={loading}
            onSearchChange={handleSearchChange}
            onSectorChange={handleSectorChange}
            onPageChange={setPage}
            currentSearch={search}
            currentSector={sector}
          />
        </section>
      </main>

      <footer className="border-t border-border/40 bg-muted/20 py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4">
          StartupRadar Intelligence Platform • SPA Architecture (Vite + React 19 + TypeScript + NestJS 11 + PostgreSQL + OpenAI)
        </div>
      </footer>
    </div>
  );
}

export default App;

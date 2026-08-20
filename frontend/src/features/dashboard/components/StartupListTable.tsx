import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StartupsResponse } from '@/features/dashboard/types/startup';
import {
  MagnifyingGlass,
  ArrowRight,
  ArrowLeft,
  Sparkle,
  Buildings,
  MapPin,
  Users,
} from '@phosphor-icons/react';

interface StartupListTableProps {
  data: StartupsResponse | null;
  loading?: boolean;
  onSearchChange?: (search: string) => void;
  onSectorChange?: (sector: string) => void;
  onPageChange?: (page: number) => void;
  currentSearch?: string;
  currentSector?: string;
}

export const StartupListTable: React.FC<StartupListTableProps> = ({
  data,
  loading = false,
  onSearchChange,
  onSectorChange,
  onPageChange,
  currentSearch = '',
  currentSector = '',
}) => {
  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange?.(searchInput);
  };

  const sectors = ['Tous', 'Artificial Intelligence', 'CleanTech', 'HealthTech', 'Cybersecurity', 'Supply Chain', 'Fintech'];

  const getScoreBadge = (score?: number | null) => {
    if (score === null || score === undefined) {
      return (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          En attente d'analyse
        </span>
      );
    }

    if (score >= 8) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Sparkle size={12} weight="fill" />
          {score} / 10 • Fort
        </span>
      );
    }

    if (score >= 5) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
          {score} / 10 • Modéré
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        {score} / 10 • Neutre
      </span>
    );
  };

  const startups = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Contrôles de Recherche et Filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher une startup, un secteur, un pays..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </form>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {sectors.map((sec) => {
            const isSelected =
              (sec === 'Tous' && !currentSector) || currentSector === sec;
            return (
              <button
                key={sec}
                onClick={() => onSectorChange?.(sec === 'Tous' ? '' : sec)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table des Startups */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[280px]">Startup</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Dernière Levée</TableHead>
              <TableHead className="text-right">Score IA & Signaux</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell><div className="h-4 w-36 rounded bg-muted"></div></TableCell>
                  <TableCell><div className="h-4 w-24 rounded bg-muted"></div></TableCell>
                  <TableCell><div className="h-4 w-16 rounded bg-muted"></div></TableCell>
                  <TableCell><div className="h-4 w-12 rounded bg-muted"></div></TableCell>
                  <TableCell><div className="h-4 w-20 rounded bg-muted"></div></TableCell>
                  <TableCell className="text-right"><div className="h-6 w-24 rounded-full bg-muted ml-auto"></div></TableCell>
                </TableRow>
              ))
            ) : startups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Buildings size={32} weight="light" className="text-muted-foreground/60" />
                    <p className="font-medium">Aucune startup trouvée</p>
                    <p className="text-xs">Modifiez vos critères de recherche ou de filtrage.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              startups.map((startup) => {
                const latestRound = startup.fundingRound?.[0];
                return (
                  <TableRow key={startup.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{startup.name}</span>
                        {startup.summary && (
                          <span className="line-clamp-1 text-xs text-muted-foreground font-normal">
                            {startup.summary}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {startup.sector}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={13} className="text-muted-foreground/80" />
                        <span>{startup.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={13} className="text-muted-foreground/80" />
                        <span>{startup.size} emp.</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {latestRound ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(latestRound.amount)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(latestRound.date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {getScoreBadge(startup.score)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
          <span>
            Affichage de {((data.page - 1) * data.limit) + 1} à{' '}
            {Math.min(data.page * data.limit, data.total)} sur {data.total} startups
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1 || loading}
              onClick={() => onPageChange?.(data.page - 1)}
              className="h-8 gap-1 rounded-lg px-2.5 text-xs"
            >
              <ArrowLeft size={14} />
              Précédent
            </Button>
            <span className="font-semibold text-foreground">
              Page {data.page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages || loading}
              onClick={() => onPageChange?.(data.page + 1)}
              className="h-8 gap-1 rounded-lg px-2.5 text-xs"
            >
              Suivant
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

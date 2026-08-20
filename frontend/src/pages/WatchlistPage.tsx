import React from 'react';
import { BookmarkSimple, CaretLeft, Sparkle, MapPin, Users, Trash, Eye, DownloadSimple } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useWatchlist } from '@/features/watchlist/context/WatchlistContext';
import { useStartups } from '@/features/dashboard/hooks/useStartups';
import { exportStartupsToCSV } from '@/lib/export';
import { toast } from 'sonner';

export const WatchlistPage: React.FC = () => {
  const { watchlistIds, toggleWatchlist, watchlistCount } = useWatchlist();
  const { data: startupsResult, isLoading } = useStartups({ limit: 100 });

  const allStartups = startupsResult?.data?.data || [];
  const savedStartups = allStartups.filter((st) => watchlistIds.includes(st.id));

  const handleExportCSV = () => {
    try {
      exportStartupsToCSV(savedStartups, 'ma-watchlist-startups.csv');
      toast.success('Watchlist exportée au format CSV !');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Mes Startups Suivies
            </h1>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <BookmarkSimple size={12} weight="fill" />
              {watchlistCount} startup{watchlistCount > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Suivi prioritaire de vos cibles d'investissement, de recrutement ou de partenariat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedStartups.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <DownloadSimple size={14} />
              Exporter Watchlist (CSV)
            </Button>
          )}

          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-1.5">
              <CaretLeft size={14} />
              Explorer les startups
            </Link>
          </Button>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : savedStartups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <BookmarkSimple size={24} weight="bold" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-foreground">
              Aucune startup épinglée pour le moment
            </h3>
            <p className="text-xs text-muted-foreground">
              Consultez le catalogue et cliquez sur l'étoile ★ pour ajouter des opportunités à votre liste de surveillance prioritaire.
            </p>
          </div>
          <Button asChild size="sm" className="font-semibold">
            <Link to="/">Découvrir les startups</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedStartups.map((st) => {
            const totalFunding =
              st.fundingRound?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

            return (
              <div
                key={st.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/startups/${st.id}`}
                        className="font-bold text-base text-foreground hover:text-primary transition-colors"
                      >
                        {st.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{st.sector}</p>
                    </div>

                    <Badge variant={st.score && st.score >= 8 ? 'success' : 'warning'} className="shrink-0 font-bold">
                      <Sparkle size={10} weight="fill" />
                      {st.score || 7}/10
                    </Badge>
                  </div>

                  {st.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {st.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {st.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {st.size}
                    </span>
                    {totalFunding > 0 && (
                      <span className="font-semibold text-foreground">
                        {totalFunding.toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <Button asChild variant="outline" size="sm" className="h-7 text-xs px-2.5">
                    <Link to={`/startups/${st.id}`} className="flex items-center gap-1">
                      <Eye size={12} />
                      Voir Fiche
                    </Link>
                  </Button>

                  <button
                    onClick={() => toggleWatchlist(st.id, st.name)}
                    className="text-xs text-destructive hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash size={12} />
                    Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

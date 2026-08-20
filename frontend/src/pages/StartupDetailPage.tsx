import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStartup } from '@/features/dashboard/hooks/useStartup';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddFundingRoundModal } from '@/features/dashboard/components/AddFundingRoundModal';
import { DeleteStartupModal } from '@/features/dashboard/components/DeleteStartupModal';
import { useWatchlist } from '@/features/watchlist/context/WatchlistContext';
import { exportStartupToJSON } from '@/lib/export';
import {
  CaretLeft,
  Sparkle,
  MapPin,
  Calendar,
  CurrencyDollar,
  TrendUp,
  WarningCircle,
  CheckCircle,
  PlusCircle,
  Trash,
  Lightning,
  Star,
  DownloadSimple,
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const StartupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isWatchlisted, toggleWatchlist } = useWatchlist();

  const { data: startupResult, isLoading, refetch } = useStartup(id);
  const startup = startupResult?.data || null;

  const [analyzing, setAnalyzing] = useState(false);
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isSaved = startup ? isWatchlisted(startup.id) : false;

  const handleTriggerAI = async () => {
    if (!startup) return;
    setAnalyzing(true);
    toast.info(`Analyse des signaux de marché en cours pour "${startup.name}"...`);

    // Simulation du calcul IA
    setTimeout(() => {
      setAnalyzing(false);
      toast.success(`Évaluation IA terminée ! Score actualisé.`);
      queryClient.invalidateQueries({ queryKey: ['startup', id] });
      queryClient.invalidateQueries({ queryKey: ['startups'] });
    }, 1200);
  };

  const handleExportJSON = () => {
    if (!startup) return;
    try {
      exportStartupToJSON(startup);
      toast.success(`Fiche de "${startup.name}" exportée au format JSON !`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 rounded bg-muted/60" />
        <div className="h-28 rounded-2xl bg-card border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-64 rounded-2xl bg-card border border-border" />
          <div className="h-64 rounded-2xl bg-card border border-border" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Startup Introuvable</h2>
        <p className="text-sm text-muted-foreground">
          La startup recherchée n'existe pas ou a été supprimée.
        </p>
        <Button asChild variant="outline">
          <Link to="/" className="inline-flex items-center gap-2">
            <CaretLeft size={16} />
            Retourner au tableau de bord
          </Link>
        </Button>
      </div>
    );
  }

  const totalFunding =
    startup.fundingRound?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Bouton Retour & Actions principales */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <CaretLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Retour au tableau de bord
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleWatchlist(startup.id, startup.name)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Star
              size={14}
              weight={isSaved ? 'fill' : 'regular'}
              className={isSaved ? 'text-amber-500' : ''}
            />
            {isSaved ? 'Épinglée dans la Watchlist' : 'Ajouter à la Watchlist'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <DownloadSimple size={14} />
            Export JSON
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerAI}
            disabled={analyzing}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkle
              size={14}
              className={analyzing ? 'animate-spin text-primary' : 'text-primary'}
              weight="fill"
            />
            {analyzing ? 'Analyse en cours...' : "Réanalyser par l'IA"}
          </Button>

          <Button
            size="sm"
            onClick={() => setFundingModalOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle size={14} weight="bold" />
            Ajouter une levée
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Trash size={14} />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Hero Card : En-tête de la startup */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {startup.name}
              </h1>
              <Badge variant="ai" className="font-bold">
                {startup.sector}
              </Badge>
              <Badge variant="outline">{startup.size} employés</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-muted-foreground/70" />
                {startup.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-muted-foreground/70" />
                Ajoutée le{' '}
                {new Date(startup.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <CurrencyDollar
                  size={14}
                  className="text-emerald-500"
                  weight="bold"
                />
                {totalFunding > 0
                  ? `${totalFunding.toLocaleString('fr-FR')} € levés`
                  : 'Bootstrapped / Fonds propres'}
              </span>
            </div>
          </div>

          {/* Badge Score IA Géant */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-background/50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkle size={32} weight="fill" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Indice IA StartupRadar
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-foreground">
                  {startup.score || 7}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  /10
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {(startup.score || 7) >= 8
                  ? '🌟 Cible hautement prioritaire'
                  : '✨ Opportunité modérée'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grille d'analyse : IA & Tours de financement */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne Gauche : Synthèse & Intelligence IA */}
        <div className="space-y-6 lg:col-span-2">
          {/* Proposition de valeur */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Lightning size={20} weight="fill" className="text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Synthèse Exécutive & Proposition de Valeur
              </h2>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {startup.summary ||
                `${startup.name} est une entreprise technologique innovante basée en ${startup.country}, active dans le segment ${startup.sector}.`}
            </p>
          </div>

          {/* Signaux de Croissance & Risques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={18} weight="fill" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Signaux Positifs Détectés
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-foreground/80">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  Effectif en expansion : tranche {startup.size} confirmée.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  Secteur à fort potentiel d'adoption ({startup.sector}).
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  {totalFunding > 0
                    ? `Capacité de financement validée : ${totalFunding.toLocaleString('fr-FR')} €`
                    : 'Modèle agile autofinancé sans dilution précoce.'}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <WarningCircle size={18} weight="fill" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Facteurs de Vigilance
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-foreground/80">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  Intensité concurrentielle élevée sur le segment {startup.sector}.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  Nécessité de consolider les barrières à l'entrée
                  technologiques.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Tours de Financement */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendUp size={18} weight="bold" className="text-emerald-500" />
                <h2 className="text-base font-bold text-foreground">
                  Tours de Table
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFundingModalOpen(true)}
                className="text-xs h-7 px-2 cursor-pointer"
              >
                + Ajouter
              </Button>
            </div>

            {startup.fundingRound && startup.fundingRound.length > 0 ? (
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {startup.fundingRound.map((round) => (
                  <div key={round.id} className="relative pl-7 space-y-0.5">
                    <span className="absolute left-2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-primary bg-background" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {round.amount.toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(round.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Tour de table consigné
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Aucun tour de table enregistré pour cette startup.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AddFundingRoundModal
        open={fundingModalOpen}
        onOpenChange={setFundingModalOpen}
        startupId={startup.id}
        startupName={startup.name}
        onSuccess={() => refetch()}
      />
      <DeleteStartupModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        startupId={startup.id}
        startupName={startup.name}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['startups'] });
          navigate('/');
        }}
      />
    </div>
  );
};

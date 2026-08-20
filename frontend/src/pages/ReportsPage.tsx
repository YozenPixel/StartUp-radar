import React, { useState } from 'react';
import {
  FileText,
  DownloadSimple,
  Sparkle,
  TrendUp,
  Calendar,
  ShieldCheck,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const ReportsPage: React.FC = () => {
  const [generating, setGenerating] = useState(false);

  const handleDownload = () => {
    toast.success('Rapport téléchargé au format Markdown !');
  };

  const handleGenerateNew = () => {
    setGenerating(true);
    toast.info('Génération d\'un nouveau digest de marché en cours via le report-service...');
    setTimeout(() => {
      setGenerating(false);
      toast.success('Nouveau digest de marché consolidé avec succès !');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* En-tête de la page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Rapports & Veille Stratégique
            </h1>
            <Badge variant="ai">Digest Hebdomadaire</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Synthèses exécutives de marché générées par le microservice <code className="text-xs bg-muted px-1.5 py-0.5 rounded">report-service</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateNew}
            disabled={generating}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkle size={14} className={generating ? 'animate-spin text-primary' : 'text-primary'} weight="fill" />
            {generating ? 'Génération...' : 'Générer un Nouveau Digest'}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <DownloadSimple size={14} weight="bold" />
            Télécharger (.md)
          </Button>
        </div>
      </div>

      {/* Vue du rapport consolidé */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Market Intelligence Digest — Édition Août 2026
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                Émis le 21 Août 2026 • 142 startups analysées
              </span>
            </div>
          </div>

          <Badge variant="success">Consolidé</Badge>
        </div>

        {/* Section Top Opportunités */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkle size={16} weight="fill" className="text-primary" />
            Top Opportunités Détectées par l'IA (Score ≥ 8/10)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">Mistral Foundry</span>
                <Badge variant="success">9.4/10</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Modèles de fondation souverains pour entreprises. 150M € cumulés.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">NeuralPulse AI</span>
                <Badge variant="success">9.0/10</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Optimisation temps réel des clusters GPU et pipelines d'inférence.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">VoltStream Grid</span>
                <Badge variant="success">8.5/10</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Équilibrage prédictif par IA des réseaux électriques haute tension.
              </p>
            </div>
          </div>
        </div>

        {/* Section Répartition */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <TrendUp size={14} className="text-emerald-500" />
            Tendance des Secteurs Dominants
          </div>
          <p className="text-xs text-muted-foreground">
            L'Intelligence Artificielle et la CleanTech représentent plus de 65% des capitaux levés ce trimestre, avec une accélération marquée sur les technologies de calcul souverain.
          </p>
        </div>
      </div>
    </div>
  );
};

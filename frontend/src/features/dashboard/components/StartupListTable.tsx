import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { StartupsResponse, Startup } from '../types/startup';
import {
  MagnifyingGlass,
  Sparkle,
  MapPin,
  Users,
  CaretLeft,
  CaretRight,
  DotsThreeVertical,
  Eye,
  PlusCircle,
  Trash,
  Copy,
  Star,
  DownloadSimple,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AddFundingRoundModal } from './AddFundingRoundModal';
import { DeleteStartupModal } from './DeleteStartupModal';
import { useWatchlist } from '@/features/watchlist/context/WatchlistContext';
import { exportStartupsToCSV } from '@/lib/export';
import { Button } from '@/components/ui/button';

interface StartupListTableProps {
  data: StartupsResponse | null;
  loading: boolean;
  onSearchChange: (search: string) => void;
  onSectorChange: (sector: string) => void;
  onPageChange: (page: number) => void;
  currentSearch: string;
  currentSector: string;
  onDataRefresh?: () => void;
}

const SECTORS = [
  'Tous les secteurs',
  'Artificial Intelligence',
  'CleanTech',
  'HealthTech',
  'Cybersecurity',
  'Fintech',
  'Robotics',
  'Supply Chain',
];

export const StartupListTable: React.FC<StartupListTableProps> = ({
  data,
  loading,
  onSearchChange,
  onSectorChange,
  onPageChange,
  currentSearch,
  currentSector,
  onDataRefresh,
}) => {
  const startups = data?.data || [];
  const page = data?.page || 1;
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const { isWatchlisted, toggleWatchlist } = useWatchlist();

  // Modales d'actions
  const [fundingModalOpen, setFundingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  const handleOpenFundingModal = (startup: Startup) => {
    setSelectedStartup(startup);
    setFundingModalOpen(true);
  };

  const handleOpenDeleteModal = (startup: Startup) => {
    setSelectedStartup(startup);
    setDeleteModalOpen(true);
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/startups/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Lien direct copié dans le presse-papier !');
  };

  const handleExportCSV = () => {
    try {
      exportStartupsToCSV(startups);
      toast.success(`${startups.length} startup(s) exportée(s) au format CSV !`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const getScoreBadge = (score?: number | null) => {
    if (!score) return <Badge variant="outline">Non évalué</Badge>;
    if (score >= 8) {
      return (
        <Badge variant="success" className="font-bold">
          <Sparkle size={12} weight="fill" />
          {score}/10 • Fort
        </Badge>
      );
    }
    if (score >= 5) {
      return (
        <Badge variant="warning" className="font-semibold">
          {score}/10 • Modéré
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        {score}/10 • Faible
      </Badge>
    );
  };

  const getTotalFunding = (startup: Startup) => {
    if (!startup.fundingRound || startup.fundingRound.length === 0) return null;
    const total = startup.fundingRound.reduce((acc, curr) => acc + curr.amount, 0);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(total);
  };

  return (
    <div className="space-y-4">
      {/* Barre de filtres, recherche et export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Rechercher une startup, pays, mot-clé..."
            value={currentSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {SECTORS.slice(0, 5).map((sec) => {
              const isSelected =
                (sec === 'Tous les secteurs' && !currentSector) ||
                currentSector === sec;
              return (
                <button
                  key={sec}
                  onClick={() =>
                    onSectorChange(sec === 'Tous les secteurs' ? '' : sec)
                  }
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {sec}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={startups.length === 0}
            className="h-8 px-2.5 text-xs flex items-center gap-1.5 cursor-pointer ml-1 shrink-0"
          >
            <DownloadSimple size={14} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tableau des Startups */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[280px]">Startup & Secteur</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Effectif</TableHead>
              <TableHead>Levées de Fonds</TableHead>
              <TableHead>Score IA & Signaux</TableHead>
              <TableHead className="w-[50px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-14 animate-pulse">
                    <div className="h-4 w-3/4 rounded bg-muted/60" />
                  </TableCell>
                </TableRow>
              ))
            ) : startups.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-36 text-center text-muted-foreground"
                >
                  Aucune startup trouvée correspondant aux critères de recherche.
                </TableCell>
              </TableRow>
            ) : (
              startups.map((st) => {
                const totalFunding = getTotalFunding(st);
                const isSaved = isWatchlisted(st.id);

                return (
                  <TableRow
                    key={st.id}
                    className="group transition-colors hover:bg-muted/40"
                  >
                    {/* Étoile de favoris */}
                    <TableCell className="pr-0">
                      <button
                        onClick={() => toggleWatchlist(st.id, st.name)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-muted-foreground/40 hover:text-amber-500'
                        }`}
                        title={isSaved ? 'Retirer de la watchlist' : 'Ajouter à la watchlist'}
                      >
                        <Star size={16} weight={isSaved ? 'fill' : 'regular'} />
                      </button>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          to={`/startups/${st.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group-hover:underline"
                        >
                          {st.name}
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {st.sector}
                          </span>
                          {st.summary && (
                            <span
                              title={st.summary}
                              className="inline-block max-w-[160px] truncate text-[10px] text-muted-foreground/70"
                            >
                              • {st.summary}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin size={13} className="text-muted-foreground/70" />
                        {st.country}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users size={13} className="text-muted-foreground/70" />
                        {st.size}
                      </div>
                    </TableCell>

                    <TableCell>
                      {totalFunding ? (
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-foreground">
                            {totalFunding}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            {st.fundingRound?.length} tour(s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Bootstrapped / Non renseigné
                        </span>
                      )}
                    </TableCell>

                    <TableCell>{getScoreBadge(st.score)}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
                            <DotsThreeVertical size={18} weight="bold" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/startups/${st.id}`} className="flex items-center gap-2">
                              <Eye size={14} />
                              Voir la fiche
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleWatchlist(st.id, st.name)}>
                            <Star size={14} weight={isSaved ? 'fill' : 'regular'} className={isSaved ? 'text-amber-500' : ''} />
                            {isSaved ? 'Retirer de la watchlist' : 'Ajouter à la watchlist'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenFundingModal(st)}>
                            <PlusCircle size={14} />
                            Ajouter une levée
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLink(st.id)}>
                            <Copy size={14} />
                            Copier le lien
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleOpenDeleteModal(st)}
                          >
                            <Trash size={14} />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination & Infos */}
        <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
          <div>
            Affichage de{' '}
            <span className="font-semibold text-foreground">
              {startups.length}
            </span>{' '}
            sur <span className="font-semibold text-foreground">{total}</span>{' '}
            startups
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              <CaretLeft size={12} />
              Précédent
            </button>
            <span className="text-xs font-medium px-1">
              Page {page} sur {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              Suivant
              <CaretRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Modales d'actions */}
      {selectedStartup && (
        <>
          <AddFundingRoundModal
            open={fundingModalOpen}
            onOpenChange={setFundingModalOpen}
            startupId={selectedStartup.id}
            startupName={selectedStartup.name}
            onSuccess={() => onDataRefresh?.()}
          />
          <DeleteStartupModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            startupId={selectedStartup.id}
            startupName={selectedStartup.name}
            onSuccess={() => onDataRefresh?.()}
          />
        </>
      )}
    </div>
  );
};

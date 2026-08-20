import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createStartup } from '@/lib/api';
import { toast } from 'sonner';
import { PlusCircle, Sparkle } from '@phosphor-icons/react';

interface CreateStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateStartupModal: React.FC<CreateStartupModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sector: 'Artificial Intelligence',
    country: 'France',
    size: '11-50',
    summary: '',
    score: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Le nom de la startup est obligatoire.');
      return;
    }

    setLoading(true);
    try {
      await createStartup({
        ...formData,
        score: Number(formData.score),
      });
      toast.success(`Startup "${formData.name}" créée avec succès !`);
      onOpenChange(false);
      onSuccess();
      setFormData({
        name: '',
        sector: 'Artificial Intelligence',
        country: 'France',
        size: '11-50',
        summary: '',
        score: 8,
      });
    } catch (error) {
      toast.error((error as Error).message || 'Échec de la création de la startup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PlusCircle size={20} weight="bold" />
              </div>
              <DialogTitle>Ajouter une Nouvelle Startup</DialogTitle>
            </div>
            <DialogDescription>
              Enregistrez une entreprise technologique innovante pour initier le suivi et le scoring IA.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Nom de la Startup *</label>
              <input
                type="text"
                required
                placeholder="Ex: QuantumEdge Labs"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Secteur d'Activité</label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="CleanTech">CleanTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Fintech">Fintech</option>
                <option value="Robotics">Robotics</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="SaaS B2B">SaaS B2B</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Pays du Siège</label>
              <input
                type="text"
                placeholder="Ex: France, Germany, USA..."
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Taille de l'Équipe</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="1-10">1-10 employés (Early)</option>
                <option value="11-50">11-50 employés (Growth)</option>
                <option value="51-200">51-200 employés (Scale-up)</option>
                <option value="200+">200+ employés (Enterprise)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Sparkle size={12} className="text-primary" />
                Score IA Estimé (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">Résumé Exécutif / Proposition de Valeur</label>
              <textarea
                rows={2}
                placeholder="Description concise du produit et positionnement marché..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer la Startup'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

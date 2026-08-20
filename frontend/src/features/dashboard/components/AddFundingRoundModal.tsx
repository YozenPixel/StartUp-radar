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
import { createFundingRound } from '@/lib/api';
import { toast } from 'sonner';
import { CurrencyDollar, Sparkle } from '@phosphor-icons/react';

interface AddFundingRoundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startupId: string;
  startupName: string;
  onSuccess: () => void;
}

export const AddFundingRoundModal: React.FC<AddFundingRoundModalProps> = ({
  open,
  onOpenChange,
  startupId,
  startupName,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(2000000);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Le montant de la levée doit être supérieur à 0.');
      return;
    }

    setLoading(true);
    try {
      await createFundingRound({
        startupId,
        amount: Number(amount),
        date: new Date(date).toISOString(),
      });
      toast.success(`Levée de fonds de ${Number(amount).toLocaleString('fr-FR')} € ajoutée pour ${startupName} !`);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error((error as Error).message || 'Échec de l\'enregistrement de la levée.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CurrencyDollar size={20} weight="bold" />
              </div>
              <DialogTitle>Ajouter une Levée de Fonds</DialogTitle>
            </div>
            <DialogDescription>
              Enregistrez un nouveau tour de table pour <strong>{startupName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Montant Levé (€) *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-muted-foreground font-semibold">EUR</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Équivalent : {Number(amount).toLocaleString('fr-FR')} €
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Date du Tour de Table *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
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
              {loading ? 'Enregistrement...' : 'Enregistrer la Levée'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

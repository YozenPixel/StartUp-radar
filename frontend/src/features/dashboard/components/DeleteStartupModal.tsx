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
import { deleteStartup } from '@/lib/api';
import { toast } from 'sonner';
import { Trash } from '@phosphor-icons/react';

interface DeleteStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startupId: string;
  startupName: string;
  onSuccess: () => void;
}

export const DeleteStartupModal: React.FC<DeleteStartupModalProps> = ({
  open,
  onOpenChange,
  startupId,
  startupName,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteStartup(startupId);
      toast.success(`Startup "${startupName}" supprimée avec succès.`);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error((error as Error).message || 'Échec de la suppression de la startup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Trash size={20} weight="bold" />
            </div>
            <DialogTitle>Confirmer la Suppression</DialogTitle>
          </div>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement la startup <strong>{startupName}</strong> ? Cette action supprimera également tous ses tours de table associés.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer Définitivement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

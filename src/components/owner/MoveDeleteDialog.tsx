'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteMoveAction } from '@/actions/marketplaceActions';
import { MOVE_DELETE_DIALOG } from '@/constants/marketplace';
import type { MoveDeleteDialogProps } from '@/types/marketplace';

export const MoveDeleteDialog = ({
  moveId,
  moveTitle,
  open,
  onOpenChange,
}: MoveDeleteDialogProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setError(null);
    onOpenChange(nextOpen);
  };

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    const result = await deleteMoveAction(moveId);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.push('/mi-mudanza');
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent aria-describedby="move-delete-description">
        <DialogHeader>
          <DialogTitle>{MOVE_DELETE_DIALOG.title}</DialogTitle>
          <DialogDescription id="move-delete-description">
            {MOVE_DELETE_DIALOG.description}
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-foreground">
          Mudanza: <span className="font-medium">{moveTitle}</span>
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            {MOVE_DELETE_DIALOG.cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : MOVE_DELETE_DIALOG.confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { EditIcon } from '@/components/icons/EditIcon';
import { updateMoveAction } from '@/actions/marketplaceActions';
import type { MoveTitleEditorProps } from '@/types/marketplace';

export const MoveTitleEditor = ({ move: initialMove }: MoveTitleEditorProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialMove.title);
  const [draft, setDraft] = useState(initialMove.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === title) {
      setDraft(title);
      setEditing(false);
      return;
    }

    setLoading(true);
    const result = await updateMoveAction(initialMove.id, { title: trimmed });
    setLoading(false);

    if (!result.success) {
      setDraft(title);
      setEditing(false);
      return;
    }

    setTitle(result.data.title);
    setDraft(result.data.title);
    setEditing(false);
    router.refresh();
  };

  const handleCancel = () => {
    setDraft(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            void handleSave();
          }
          if (e.key === 'Escape') handleCancel();
        }}
        disabled={loading}
        autoFocus
        maxLength={120}
        className="h-9 max-w-xs text-xl font-bold"
        aria-label="Editar nombre de la mudanza"
      />
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <h1 className="truncate text-xl font-bold">{title}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="shrink-0 rounded p-1 text-warm-muted transition-colors hover:text-teal-600"
        aria-label="Editar título"
      >
        <EditIcon className="h-4 w-4 opacity-60" />
      </button>
    </div>
  );
};

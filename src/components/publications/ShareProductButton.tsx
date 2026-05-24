'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShareIcon } from '@/components/icons/ShareIcon';
import { getProductPublicPath, COMPACT_CHIP_CLASS } from '@/constants/marketplace';
import { cn } from '@/lib/utils/cn';
import type { ShareProductButtonProps } from '@/types/marketplace';

export const ShareProductButton = ({ slug, itemId, title, compact = false }: ShareProductButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const path = getProductPublicPath(slug, itemId);
    const url = `${window.location.origin}${path}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard.
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleShare}
      className={cn(compact ? COMPACT_CHIP_CLASS : 'h-8 px-3 text-xs', 'gap-1')}
    >
      <ShareIcon className={cn(compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {copied ? 'Copiado' : 'Compartir'}
    </Button>
  );
};

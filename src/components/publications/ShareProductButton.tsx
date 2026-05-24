'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShareIcon } from '@/components/icons/ShareIcon';
import { getProductPublicPath, COMPACT_CHIP_CLASS } from '@/constants/marketplace';
import { cn } from '@/lib/utils/cn';
import type { ShareProductButtonProps } from '@/types/marketplace';

export const ShareProductButton = ({
  slug,
  itemId,
  title,
  compact = false,
  fullWidth = false,
}: ShareProductButtonProps) => {
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

  const label = copied ? 'Link copiado' : 'Compartir';

  return (
    <Button
      type="button"
      variant={fullWidth ? 'default' : 'outline'}
      onClick={handleShare}
      className={cn(
        fullWidth ? 'h-11 w-full gap-2' : compact ? COMPACT_CHIP_CLASS : 'h-8 px-3 text-xs',
        !fullWidth && 'gap-1',
      )}
    >
      <ShareIcon className={cn(fullWidth ? 'h-4 w-4' : compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {label}
    </Button>
  );
};

import type { InputHTMLAttributes } from 'react';
import type { CurrencyCode } from '@/constants/marketplace';

export type ImageDropzoneProps = {
  id: string;
  label?: string;
  hint?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
};

export type PriceInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  currency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
};

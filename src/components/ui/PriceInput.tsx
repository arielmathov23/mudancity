'use client';

import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY_CODE } from '@/constants/marketplace';
import { formatPriceDisplay, parsePriceDisplayToRaw } from '@/lib/format/price';
import { cn } from '@/lib/utils/cn';
import type { CurrencyCode } from '@/constants/marketplace';
import type { PriceInputProps } from '@/types/ui';

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  (
    {
      className,
      currency = DEFAULT_CURRENCY_CODE,
      onCurrencyChange,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [displayValue, setDisplayValue] = useState(() =>
      formatPriceDisplay(String(defaultValue ?? '')),
    );

    const shownValue = isControlled ? formatPriceDisplay(String(value ?? '')) : displayValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parsePriceDisplayToRaw(event.target.value);
      const formatted = formatPriceDisplay(raw);

      if (!isControlled) {
        setDisplayValue(formatted);
      }

      onChange?.({
        ...event,
        target: { ...event.target, value: raw },
        currentTarget: { ...event.currentTarget, value: raw },
      });
    };

    return (
      <div className="flex w-full">
        {onCurrencyChange ? (
          <select
            aria-label="Moneda"
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value as CurrencyCode)}
            className="h-10 w-[4.75rem] shrink-0 cursor-pointer appearance-none border border-r-0 border-line bg-cream-100 bg-[length:0.6rem] bg-[position:right_0.5rem_center] bg-no-repeat pl-2.5 pr-5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
            }}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span
            aria-hidden
            className="inline-flex h-10 shrink-0 items-center border border-r-0 border-line bg-cream-100 px-3 text-xs font-medium text-warm-muted"
          >
            {currency}
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          className={cn('min-w-0 flex-1', className)}
          value={shownValue}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  },
);

PriceInput.displayName = 'PriceInput';

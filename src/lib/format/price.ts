import { DEFAULT_CURRENCY_CODE, DEFAULT_CURRENCY_LOCALE } from '@/constants/marketplace';

/** Raw price string: digits with optional decimal comma (no thousand separators). */
export const sanitizePriceRawInput = (value: string): string => {
  const cleaned = value.replace(/[^\d,]/g, '');
  const commaIndex = cleaned.indexOf(',');
  if (commaIndex === -1) return cleaned;

  const intPart = cleaned.slice(0, commaIndex);
  const decPart = cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, 2);
  return decPart ? `${intPart},${decPart}` : intPart;
};

export const parsePriceDisplayToRaw = (display: string): string =>
  sanitizePriceRawInput(display.replace(/\./g, ''));

export const formatPriceDisplay = (raw: string): string => {
  const sanitized = sanitizePriceRawInput(raw.replace(/\./g, ''));
  if (!sanitized) return '';

  const [intPart = '', decPart] = sanitized.split(',');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
};

export const formatMoneyDisplay = (price: number, currency = DEFAULT_CURRENCY_CODE): string => {
  const formatted = price.toLocaleString(DEFAULT_CURRENCY_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
};

/** DB number → raw string for PriceInput (e.g. 799999.99 → "799999,99"). */
export const numberToPriceRaw = (price: number): string => {
  if (!Number.isFinite(price)) return '';

  const rounded = Math.round(price * 100) / 100;
  if (Number.isInteger(rounded)) return String(Math.trunc(rounded));

  return rounded.toLocaleString(DEFAULT_CURRENCY_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
};

export const parsePriceRawToNumber = (raw: string): number => {
  if (!raw) return Number.NaN;

  if (raw.includes(',')) {
    return Number.parseFloat(raw.replace(/\./g, '').replace(',', '.'));
  }

  // Fallback when a JS number string slips through (e.g. "799999.99").
  if (/^\d+\.\d{1,2}$/.test(raw)) {
    return Number.parseFloat(raw);
  }

  return Number.parseFloat(raw.replace(/\./g, ''));
};

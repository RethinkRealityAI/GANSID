'use client';
import { useRowLabel } from '@payloadcms/ui';

/** Shows a menu item's or link's own label on its row instead of "Item 01". */
export function LabelRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string | Record<string, string> | null }>();
  const label = typeof data?.label === 'string' ? data.label : undefined;
  return <span>{label || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>;
}

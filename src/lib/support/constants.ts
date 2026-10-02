// src/lib/support/constants.ts
const raw = Number(import.meta.env.VITE_CLOSED_VISIBLE_DAYS ?? 30);

export const CLOSED_VISIBLE_DAYS = Number.isFinite(raw) ? raw : 30;

export function getClosedCutoffISO(d = CLOSED_VISIBLE_DAYS): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}
import { TiketWithDetails } from '@/types/ticket.types';

/**
 * @deprecated
 * Seluruh data mock tiket Kanban telah dimigrasikan ke endpoint Real API backend (/tiket).
 * Konstanta ini dipertahankan sebagai empty object untuk backward compatibility.
 */
export const INITIAL_TICKETS_BY_STAGE: Record<string, TiketWithDetails[]> = {};

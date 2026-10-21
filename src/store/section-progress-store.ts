import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { OVA_STORAGE_KEY } from '@/shared/utils/storage-key';

export interface PageSectionProgress {
  /** Total de secciones del `Panel` de la página. */
  total: number;
  /** Índices (base 0) de las secciones que el usuario ya abrió. */
  visited: number[];
}

interface SectionProgressStore {
  /** Progreso por path de página (solo páginas que tienen un `Panel`). */
  pages: Record<string, PageSectionProgress>;

  /** Marca una sección como vista. Idempotente: no duplica entradas ni re-renderiza si no hay cambios. */
  markSectionVisited: (path: string, index: number, total: number) => void;

  /** Olvida las secciones vistas de todas las páginas. */
  resetSectionProgress: () => void;
}

export const useSectionProgressStore = create<SectionProgressStore>()(
  devtools(
    persist(
      (set) => ({
        pages: {},

        markSectionVisited: (path, index, total) =>
          set((state) => {
            const current = state.pages[path];
            if (current && current.total === total && current.visited.includes(index)) return state;

            return {
              pages: {
                ...state.pages,
                [path]: {
                  total,
                  visited: current?.visited.includes(index) ? current.visited : [...(current?.visited ?? []), index]
                }
              }
            };
          }),

        resetSectionProgress: () => set({ pages: {} })
      }),
      {
        name: `${OVA_STORAGE_KEY}:section-progress`,
        storage: createJSONStorage(() => localStorage)
      }
    ),
    { name: 'SectionProgressStore' }
  )
);

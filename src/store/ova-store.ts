import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { OVA_STORAGE_KEY } from '@/shared/utils/storage-key';

import { useSectionProgressStore } from './section-progress-store';

import type { Language, OvaPageType } from '../types/types';

/**
 * La galería no tiene una secuencia de páginas de OVA: la ruta de cada juego
 * es independiente. Se conserva el campo para mantener compatible el store
 * con los componentes de `shared` (learning-path, menu, medallas).
 */
export const BASE_PAGES: Omit<OvaPageType, 'visited'>[] = [];

/**
 * Lee el flag `hasSeenModel3D` directo de localStorage, sin esperar a que el
 * store (persist es asíncrono) rehidrate. Usado como estado inicial de
 * `started` en `LearningPath`/`Experience`, evitando parpadeos.
 */
export function readModel3DSeen(): boolean {
  try {
    const raw = localStorage.getItem(`${OVA_STORAGE_KEY}:ova-session`);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { state?: { hasSeenModel3D?: boolean } };
    return parsed.state?.hasSeenModel3D === true;
  } catch {
    return false;
  }
}

interface OvaStore {
  baseTitle: string;
  lang: Language;
  pages: OvaPageType[];
  visitedPages: string[];
  selectedAvatarId: string | null;
  /** True desde la primera vez que se entra al modelo 3D (ya no muestra el overlay). */
  hasSeenModel3D: boolean;

  /** Marca un path como visitado. Idempotente: no duplica entradas. Si no se pasa path usa el actual. */
  markPageVisited: (path?: string) => void;

  /** Limpia todas las páginas visitadas. */
  resetVisitedPages: () => void;

  /** Persiste el avatar seleccionado por el usuario. */
  selectAvatar: (id: string) => void;

  /** Marca el modelo 3D como ya visitado (oculta su overlay la próxima vez). */
  markModel3DSeen: () => void;
}

export const useOvaStore = create<OvaStore>()(
  devtools(
    persist(
      (set) => ({
        baseTitle: document.title,
        lang: (document.documentElement?.lang ?? 'es') as Language,
        pages: BASE_PAGES.map((p) => ({ ...p, visited: false })),
        visitedPages: [],
        selectedAvatarId: null,
        hasSeenModel3D: false,

        markPageVisited: (path) =>
          set((state) => {
            const currentPath = path ?? (window.location.hash.replace(/^#/, '') || '/');
            if (state.visitedPages.includes(currentPath)) return state;
            return {
              visitedPages: [...state.visitedPages, currentPath],
              pages: state.pages.map((p) => (p.path === currentPath ? { ...p, visited: true } : p))
            };
          }),

        resetVisitedPages: () => {
          // Las secciones vistas de cada Panel son parte del mismo progreso: se reinician juntas.
          useSectionProgressStore.getState().resetSectionProgress();
          set({
            visitedPages: [],
            pages: BASE_PAGES.map((p) => ({ ...p, visited: false }))
          });
        },

        selectAvatar: (id) => set({ selectedAvatarId: id }),

        markModel3DSeen: () => set({ hasSeenModel3D: true })
      }),
      {
        name: `${OVA_STORAGE_KEY}:ova-session`,
        storage: createJSONStorage(() => localStorage),
        /** Solo persiste los campos que deben sobrevivir a recargas de página. */
        partialize: (state) => ({
          visitedPages: state.visitedPages,
          selectedAvatarId: state.selectedAvatarId,
          hasSeenModel3D: state.hasSeenModel3D
        }),
        /** Reconstruye `pages` con la info de visitas tras rehidratar desde sessionStorage. */
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.pages = BASE_PAGES.map((p) => ({
              ...p,
              visited: state.visitedPages.includes(p.path)
            }));
          }
        }
      }
    ),
    { name: 'OvaStore' }
  )
);

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OverlayQueueStore {
  /** Orden de solicitud; queue[0] es el único diálogo que puede mostrarse. */
  queue: string[];
  /** Idempotente: no-op si `id` ya está en la cola. */
  request: (id: string) => void;
  /** Lo saca de la cola; si era el activo, el siguiente pasa a serlo solo. */
  release: (id: string) => void;
}

export const useOverlayQueueStore = create<OverlayQueueStore>()(
  devtools(
    (set) => ({
      queue: [],

      request: (id) =>
        set((state) => (state.queue.includes(id) ? state : { queue: [...state.queue, id] })),

      release: (id) => set((state) => ({ queue: state.queue.filter((queuedId) => queuedId !== id) }))
    }),
    { name: 'OverlayQueueStore' }
  )
);

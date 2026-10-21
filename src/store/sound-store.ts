import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { OVA_STORAGE_KEY } from '@/shared/utils/storage-key';

interface SoundStore {
  /** Silencia todos los efectos de sonido de interacción (clics, etc.). No afecta al audio descriptivo. */
  muted: boolean;
  /** Volumen de los efectos de sonido, entre 0 y 1. */
  volume: number;

  toggleMuted: () => void;
  setVolume: (volume: number) => void;
}

export const useSoundStore = create<SoundStore>()(
  devtools(
    persist(
      (set) => ({
        muted: false,
        volume: 0.6,

        toggleMuted: () => set((state) => ({ muted: !state.muted })),
        setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) })
      }),
      {
        name: `${OVA_STORAGE_KEY}:sound-settings`,
        storage: createJSONStorage(() => localStorage)
      }
    ),
    { name: 'SoundStore' }
  )
);

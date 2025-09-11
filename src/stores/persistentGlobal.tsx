import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type PersistentGlobal = {
   playMusic: boolean,
   playSoundEffects: boolean,
   updatePersistent: (partial: Record<string, unknown>) => void,
}

export const usePersistentGlobal = create<PersistentGlobal>()(persist(
   (set, get) => ({
      playMusic: true,
      playSoundEffects: true,
      updatePersistent: (partial: Partial<PersistentGlobal>) => set(partial),
   }),
   { name: 'persistent-storage', storage: createJSONStorage(() => sessionStorage), })
)
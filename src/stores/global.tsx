import { create } from 'zustand'

type CursorCoordinates = {
   x: number,
   y: number
}

type Store = {
   count: number
   inc: () => void,
   cursorCoordinates: CursorCoordinates,
   setCursorCoordinates: (cursorCoordinates: CursorCoordinates) => void
}

export const useGlobal = create<Store>()((set) => ({
   count: 1,
   inc: () => set((state) => ({ count: state.count + 1 })),
   cursorCoordinates: {
      x: 0,
      y: 0,
   },
   setCursorCoordinates: (value: CursorCoordinates) => set(() => ({ cursorCoordinates: value }))
}))
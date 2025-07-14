import { create } from 'zustand'

type CursorCoordinates = {
   x: number,
   y: number
}

type CanvasSize = {
   height: number,
   width: number,
}

type Store = {
   cursorCoordinates: CursorCoordinates,
   canvasSize: CanvasSize,
   update: (partial: Record<string, unknown>) => void
}

export const useGlobal = create<Store>()((set) => ({
   cursorCoordinates: {
      x: 0,
      y: 0,
   },
   canvasSize: {
      height: 0,
      width: 0
   },
   update: (partial: Record<string, unknown>) => set(partial)
}))
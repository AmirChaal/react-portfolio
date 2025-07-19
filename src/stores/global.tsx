import { create } from 'zustand'

type CurrentView = 'home' | 'works' | 'about-me'

type CursorCoordinates = {
   x: number,
   y: number
}

type CanvasSize = {
   height: number,
   width: number,
}

type Store = {
   currentView: CurrentView
   cursorCoordinates: CursorCoordinates,
   canvasSize: CanvasSize,
   update: (partial: Record<string, unknown>) => void
}

export const useGlobal = create<Store>()((set) => ({
   currentView: 'home',
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
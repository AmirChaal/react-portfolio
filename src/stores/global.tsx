import { LoadingManager, TextureLoader, Vector2 } from 'three'
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
   textureLoader: TextureLoader,
   floatiesColor: string,
   backgroundColor: string,
   textColor: string,
   tonicColor: string

   currentView: CurrentView
   cursorCoordinates: CursorCoordinates,
   canvasSize: CanvasSize,
   update: (partial: Record<string, unknown>) => void,
   getNDC: () => Vector2
}

export const useGlobal = create<Store>()((set, get) => ({
   textureLoader: new TextureLoader(new LoadingManager(() => console.log('load'), () => console.log('progress'), () => console.log('error'))),
   floatiesColor: "#6f5643",
   backgroundColor: "#ece6c2",
   textColor: "#6f5643",
   tonicColor: "#73bda8",

   currentView: 'home',
   cursorCoordinates: {
      x: 0,
      y: 0,
   },
   canvasSize: {
      height: 0,
      width: 0
   },
   update: (partial: Record<string, unknown>) => set(partial),
   getNDC: () => {
      const { cursorCoordinates, canvasSize } = get()
      const { x, y } = cursorCoordinates
      const { width, height } = canvasSize

      return new Vector2(
         (x / width) * 2 - 1,
         -((y / height) * 2 - 1)
      )
   }
}))

// Palette
// #6f5643
// #cc6b49
// #d2a24c 
// #ece6c2 
// #73bda8
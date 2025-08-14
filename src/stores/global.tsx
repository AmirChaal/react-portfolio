import { LoadingManager, Texture, TextureLoader, Vector2 } from 'three'
import { create } from 'zustand'

type CurrentView = 'home' | 'works' | 'about'

type Store = {
   loadingManager: LoadingManager,
   textureLoader: TextureLoader,
   texturesLoaded: boolean,
   textures: Record<string, Texture[]>

   backgroundColor: string,
   floatiesColor: string,
   textColor: string,
   stirrerColor: string,
   cursorIndicatorColor: string,

   currentView: CurrentView
   cursorCoordinates: {
      x: number,
      y: number
   },
   canvasSize: {
      height: number,
      width: number,
   },
   update: (partial: Record<string, unknown>) => void,
   getNDC: () => Vector2
}

// Create store first so we can access `set` inside LoadingManager callbacks
export const useGlobal = create<Store>()((set, get) => {
   const loadingManager = new LoadingManager()
   // loadingManager.onStart = (url, itemsLoaded, itemsTotal) => console.log(`Started loading: ${url} (${itemsLoaded} of ${itemsTotal})`)
   // loadingManager.onLoad = () => {
   //    console.log('✅ All assets loaded')
   //    set({ texturesLoaded: true })
   // }
   // loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => console.log(`Loading file: ${url} (${itemsLoaded} of ${itemsTotal})`)
   // loadingManager.onError = (url) => console.error(`❌ Error loading ${url}`)

   const textureLoader = new TextureLoader(loadingManager)

   return {
      loadingManager,
      textureLoader,
      texturesLoaded: false,
      textures: {
         smallFloatyTextures: [],
         mediumFloatyTextures: [],
         bigFloatyTextures: []
      },

      // Colors
      floatiesColor: "#E9D4AB",
      backgroundColor: "#ece6c2",
      textColor: "#43636F",
      stirrerColor: "#d2a24c",
      cursorIndicatorColor: "#cc6b49",

      currentView: 'home',
      cursorCoordinates: { x: 0, y: 0 },
      canvasSize: { height: 0, width: 0 },

      update: (partial) => set(partial),
      getNDC: () => {
         const { cursorCoordinates, canvasSize } = get()
         const { x, y } = cursorCoordinates
         const { width, height } = canvasSize

         return new Vector2(
            (x / width) * 2 - 1,
            -((y / height) * 2 - 1)
         )
      }
   }
})

// Palette
// #43636F dark dlue
// #6f5643 brown
// #cc6b49 orange
// #d2a24c yellow
// #ece6c2 white
// #73bda8 tonic blue
// #E9D4AB beige (old floaties color)
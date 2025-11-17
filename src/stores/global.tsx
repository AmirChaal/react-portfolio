import type { ObjectMap } from '@react-three/fiber'
import { useRef, type ReactElement, type RefObject } from 'react'
import { LoadingManager, Texture, TextureLoader, Vector2 } from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/Addons.js'
import { create } from 'zustand'
import type { IconComponentProps } from '../types/component'
import type { detectInputMethod } from '../functions/interactivity'
import type { RapierRigidBody } from '@react-three/rapier'

type CurrentView = 'home' | 'works' | 'about'

export type Notification = {
   id: number,
   icon: ReactElement<IconComponentProps>,
   text: string
}

export type GlobalStore = {
   textureLoader: TextureLoader,
   gltfLoader: GLTFLoader,
   textures: Record<string, Texture>
   models: Record<string, GLTF & ObjectMap>
   texturesLoaded: boolean,
   modelsLoaded: boolean,
   floatiesCanvasFirstFrameGenerated: boolean
   behindCanvasFirstFrameGenerated: boolean
   currentView: CurrentView
   cursorCoordinates: { x: number, y: number },
   deviceSize: { height: number, width: number, },
   avyScreenTexture: null | Texture
   inputMethod: ReturnType<typeof detectInputMethod>
   notifications: Notification[]
   getNotifications: () => Notification[],
   backgroundColor: string,
   floatiesColor: string,
   textColor: string,
   stirrerColor: string,
   cursorIndicatorColor: string,
   avyAmbientLight: string,
   avyDirectionalLight: string,
   changeAvyScreenWorkTexture: null | ((texture: Texture | null) => void)
   update: (partial: Record<string, unknown>) => void,
   getNDC: () => Vector2
   globalStirrerBody: null | RapierRigidBody
   enteredApplication: boolean
}

export const useGlobal = create<GlobalStore>()((set, get) => {
   const textureLoadingManager = new LoadingManager(() => set({ texturesLoaded: true }),);

   const modelLoadingManager = new LoadingManager(() => set({ modelsLoaded: true }),);

   const textureLoader = new TextureLoader(textureLoadingManager);
   const gltfLoader = new GLTFLoader(modelLoadingManager);

   return {
      /**
       * Loaded content
       */
      textureLoader,
      gltfLoader,
      textures: {},
      models: {},

      // Loading flags
      texturesLoaded: false,
      modelsLoaded: false,
      floatiesCanvasFirstFrameGenerated: false,
      behindCanvasFirstFrameGenerated: false,

      // Audio control
      playMusic: false,
      playSoundEffects: true,

      // Global variables
      enteredApplication: false,
      currentView: 'home',
      cursorCoordinates: { x: 0, y: 0 },
      deviceSize: { height: 0, width: 0 },
      avyScreenTexture: null,
      inputMethod: 'cursor',
      notifications: [],
      changeAvyScreenWorkTexture: null,
      getNotifications: (() => get().notifications),

      // Colors
      backgroundColor: "#ece6c2",
      floatiesColor: "#E9D4AB",
      textColor: "#6f5643",
      stirrerColor: "#73bda8",
      cursorIndicatorColor: "#6f5643",
      avyAmbientLight: "#FF8700",
      avyDirectionalLight: "#ECE6C2",

      // Physics
      globalStirrerBody: null,

      update: (partial) => set(partial),
      getNDC: () => {
         const { cursorCoordinates, deviceSize } = get()
         const { x, y } = cursorCoordinates
         const { width, height } = deviceSize

         const unclampedNdc = new Vector2(
            (x / width) * 2 - 1,
            -((y / height) * 2 - 1)
         )

         const clampedNdc = new Vector2(
            Math.min(1, Math.max(-1, unclampedNdc.x)),
            Math.min(1, Math.max(-1, unclampedNdc.y))
         )

         return clampedNdc
      }
   }
})

// Palette
// #43636F dark dlue
// #6f5643 brown
// #cc6b49 orange
// #d2a24c yellow
// #ece6c2 light beige
// #73bda8 tonic blue
// #E9D4AB beige (old floaties color)


/**
 * Colors
 */
// Recro dark theme
// backgroundColor: "#ffffff",
// floatiesColor: "#E6E6E6",
// textColor: "#000000",
// stirrerColor: "#56C7FF",
// cursorIndicatorColor: "#000000",
// avyAmbientLight: "",
// avyDirectionalLight: "",

// Recro white theme
// backgroundColor: "#ffffff",
// floatiesColor: "#E6E6E6",
// textColor: "#000000",
// stirrerColor: "#56C7FF",
// cursorIndicatorColor: "#000000",
// avyAmbientLight: "#56C7FF",
// avyDirectionalLight: "#56C7FF",
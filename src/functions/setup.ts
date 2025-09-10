import { useEffect } from "react";
import { useGlobal, type GlobalStore } from "../stores/global";

export function useCanvasSize() {
   const { update } = useGlobal()

   useEffect(() => {
      const canvas = document.querySelector('#webGL-behind-canvas')
      if (canvas == null) throw new Error('canvas is null')

      const updateFuntion = () => {
         update({
            canvasSize: {
               height: canvas.clientHeight,
               width: canvas.clientWidth
            }
         })
      }

      updateFuntion()

      window.addEventListener('resize', updateFuntion)

      return () => window.removeEventListener('resize', updateFuntion)

   }, [update])
}

export function useDeviceSize() {
   const { update } = useGlobal()

   useEffect(() => {
      const updateFuntion = () => {
         const height = window.innerHeight
         const width = window.innerWidth

         update({
            deviceSize: {
               height: height,
               width: width
            }
         })
      }

      updateFuntion()

      window.addEventListener('resize', updateFuntion)

      return () => window.removeEventListener('resize', updateFuntion)
   }, [update])
}

export function loadTextures(global: GlobalStore) {
   const provideTextures = (textureLabel: string, path: string) => {
      const loadedTexture = global.textureLoader.load(path)
      global.textures[textureLabel] = loadedTexture;
      global.update({ textures: global.textures });
   };

   useEffect(() => {
      provideTextures("floatyAt", "/floaties-textures/at.png");
      provideTextures("floatyAnd", "/floaties-textures/and.png");
      provideTextures("floatyDollar", "/floaties-textures/dollar.png");
      provideTextures("floatyHash", "/floaties-textures/hash.png");
      provideTextures("floatyLess", "/floaties-textures/less.png");
      provideTextures("floatyN", "/floaties-textures/n.png");
      provideTextures("floatyX", "/floaties-textures/x.png");
      provideTextures("floatyE", "/floaties-textures/e.png");
      provideTextures("floatyS", "/floaties-textures/s.png")
      provideTextures("floatyO", "/floaties-textures/o.png")
      provideTextures("floatyDot", "/floaties-textures/dot.png")
      provideTextures("floatyComma", "/floaties-textures/comma.png")
      provideTextures("avyScreenA", "/avy-screen-textures/a.png")
      provideTextures("avyScreenB", "/avy-screen-textures/b.png")
      provideTextures("avyScreenC", "/avy-screen-textures/c.png")
      provideTextures("avyScreenD", "/avy-screen-textures/d.png")
      provideTextures("avyScreenE", "/avy-screen-textures/e.png")
      provideTextures("avyScreenSeekerAssist", "/avy-screen-textures/seeker_assist.png")
      provideTextures("avyScreenPortfolio", "/avy-screen-textures/portfolio.png")
      provideTextures("avyScreenIllustrations", "/avy-screen-textures/illustrations.png")
      provideTextures("avyScreenNoise", "/avy-screen-textures/noise.png")
      provideTextures("avyScreenDefault", "/avy-screen-textures/default.png")
      provideTextures("avyCuteOpenEye", "/avy-screen-textures/cute_open_eye.png")
      provideTextures("avyCuteClosedLeftEye", "/avy-screen-textures/cute_closed_left_eye.png")
      provideTextures("avyCuteClosedRightEye", "/avy-screen-textures/cute_closed_right_eye.png")
      provideTextures("avyCuteOpenMouth", "/avy-screen-textures/cute_open_mouth.png")
      provideTextures("avyCuteClosedMouth", "/avy-screen-textures/cute_closed_mouth.png")
   }, [])
}

// export function loadTextures(textureHolder: GlobalStore['textures'], textureLoader: GlobalStore['textureLoader'], updateGlobal: GlobalStore['update']) {
//    const provideTextures = (textureLabel: string, path: string) => {
//       const loadedTexture = textureLoader.load(path)
//       textureHolder[textureLabel] = loadedTexture;
//       updateGlobal({ textureHolder: textureHolder });
//    };
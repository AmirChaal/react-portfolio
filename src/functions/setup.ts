import { useEffect } from "react";
import { useGlobal } from "../stores/global";

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
            canvasSize: {
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
import { Canvas } from '@react-three/fiber'
import { WebGLBehindCanvas } from './WebGLBehindCanvas'
import { useEffect, useState } from 'react'
import gsap from 'gsap'

export function WebGLBehindCanvasWrapper({ visible }: { visible: boolean }) {
   /**
    * Opacity
   */
   const [opacity, setOpacity] = useState(visible ? 1 : 0)
   useEffect(() => {
      gsap.to({ value: opacity }, {
         value: visible ? 1 : 0,
         duration: 0.5,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () { setOpacity(this.targets()[0].value) }
      })
   }, [visible])

   /**
   * Blur
   */
   const maxBlur = 100
   const [blur, setBlur] = useState((visible) ? 0 : maxBlur)
   useEffect(() => {
      gsap.to({ value: blur }, {
         value: visible ? 0 : maxBlur,
         duration: 0.5,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () { setBlur(this.targets()[0].value) }
      })
   }, [visible])

   return (
      <Canvas id="webGL-behind-canvas" className="h-full w-full absolute!" camera={{ position: [0, 0, 5], fov: 30 }} style={{ filter: `blur(${blur}px)` }} shadows>
         <WebGLBehindCanvas visible={visible} />
      </Canvas>
   )
}

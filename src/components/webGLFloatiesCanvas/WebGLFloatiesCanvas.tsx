import { Canvas, useThree } from "@react-three/fiber";
import WebGLFloatiesPhysicsWrapper from "./WebGLFloatiesPhysicsWrapper";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function WebGLFloatiesCanvas({ visible }: { visible: boolean }) {
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
   const maxBlur = 20
   const [blur, setBlur] = useState(visible ? 0 : maxBlur)
   useEffect(() => {
      gsap.to({ value: blur }, {
         value: visible ? 0 : maxBlur,
         duration: 0.5,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () { setBlur(this.targets()[0].value) }
      })
   }, [visible])

   return (
      <Canvas frameloop="always" id="webGL-floaties-canvas " className="h-full w-full absolute!" orthographic camera={{ zoom: 60, position: [0, 0, 10] }} style={{ opacity: opacity, filter: `blur(${blur}px)` }} >
         <WebGLFloatiesPhysicsWrapper visible={visible} />
      </Canvas>
   )
}
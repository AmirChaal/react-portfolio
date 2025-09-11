import { Physics } from "@react-three/rapier";
import WebGLFloaties from "./WebGLFloaties";
import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

export default function WebGLFloatiesPhysicsWrapper({ visible, focused }: { visible: boolean, focused: boolean }) {
   /**
   * Zoom
   */
   const minZoom = 60
   const maxZoom = 150
   const [zoom, setZoom] = useState(visible ? minZoom : maxZoom)
   useEffect(() => {
      gsap.to({ value: zoom }, {
         value: visible ? minZoom : maxZoom,
         duration: 1,
         ease: visible ? "power4.out" : "power4.in",
         onUpdate: function () { setZoom(this.targets()[0].value) }
      })
   }, [visible])

   const { camera } = useThree()
   useEffect(() => {
      camera.zoom = zoom;
      camera.updateProjectionMatrix();
   }, [zoom, camera]);

   useFrame((state) => {
      state.camera.zoom = 60
      state.camera.updateProjectionMatrix()
   })

   return (
      <Physics>
         <WebGLFloaties focused={focused} />
      </Physics>
   )
}
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useGlobal } from "../../stores/global";
import AvyHead from "../AvyHead/AvyHead";
import { useFrame } from '@react-three/fiber'
import { Mesh, type DirectionalLight } from "three";

export function WebGLBehindCanvas({ visible }: { visible: boolean }) {
   const { avyAmbientLight, avyDirectionalLight, inputMethod, deviceSize } = useGlobal()
   const lightRef = useRef<DirectionalLight>(null!)
   const avyHeadRef = useRef(null) as RefObject<null | Mesh>

   // useEffect(() => {
   //    if (lightRef.current) {
   //       const helper = new CameraHelper(lightRef.current.shadow.camera)
   //       scene.add(helper)
   //       return () => {
   //          scene.remove(helper)
   //          helper.dispose()
   //       }
   //    }
   // }, [scene])

   // lightRef.current.shadow.camera

   const effectiveVisibility = useMemo(() => {
      return (visible && inputMethod === "cursor" && deviceSize.width > 1100)
   }, [visible, inputMethod, deviceSize.width])

   useFrame(() => {
      if (avyHeadRef.current == null) return
      lightRef.current.target = avyHeadRef.current
   })

   return (
      <>
         <ambientLight color={avyAmbientLight} intensity={2.25} />
         <directionalLight
            ref={lightRef}
            color={avyDirectionalLight}
            castShadow
            position={[0, 1, 1]}
            shadow-bias={-0.0001}
            shadow-camera-top={2}
            shadow-camera-right={2}
            shadow-camera-bottom={-2}
            shadow-camera-left={-2}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
         />
         <AvyHead ref={avyHeadRef} visible={effectiveVisibility} />
      </>
   )
}

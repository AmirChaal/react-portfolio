import { useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useEffect, useRef, useState, type RefObject } from "react"
import { Mesh, Vector3 } from "three"
import { useGlobal } from "../../stores/global"

export default function WebGLPointerIndicator({ visible, cursor3DPosition }: { visible: boolean, cursor3DPosition: Vector3 | null }) {
   const pointerIndicatorRef = useRef(null) as RefObject<Mesh | null>
   const [pointerIndicatorMeshRadius, setPointerIndicatorMeshRadius] = useState(visible ? 0.2 : 0)
   const {textColor} = useGlobal()

   useEffect(() => {
      gsap.to({ value: pointerIndicatorMeshRadius}, {
         value: visible ? 0.2 : 0,
         duration: 1,
         ease: visible ? "elastic.out(1.5,0.2)" : "power2.out",
         onUpdate: function () { setPointerIndicatorMeshRadius(this.targets()[0].value) }
      })
   }, [visible])

   /**
    * useFrame
    */
   const elapsedTimeRef = useRef(0)
   useFrame((state, delta) => {
      elapsedTimeRef.current += delta

      if (pointerIndicatorRef.current != null && cursor3DPosition != null) {
         // Position
         pointerIndicatorRef.current.position.copy(new Vector3(cursor3DPosition.x, cursor3DPosition.y, 3))

         // Scale
         pointerIndicatorRef.current.scale.x = pointerIndicatorMeshRadius
         pointerIndicatorRef.current.scale.y = pointerIndicatorMeshRadius

         // Rotation
         pointerIndicatorRef.current.rotation.z = elapsedTimeRef.current
      }
   });

   return (
      <mesh ref={pointerIndicatorRef} scale={0.15} >
         <torusGeometry args={[1, 0.3, 2, 3]} />
         <meshBasicMaterial color={textColor} />
      </mesh>
   )
}
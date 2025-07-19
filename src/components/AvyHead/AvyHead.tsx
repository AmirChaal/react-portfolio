import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, type RefObject } from "react"
import { useGlobal } from "../../stores/global"
import { Vector3, type Mesh } from "three"
import AvyHeadModel from "./AvyHeadModel"

export default function AvyHead() {
   const { currentView, cursorCoordinates, canvasSize } = useGlobal()
   const head = useRef({}) as RefObject<Mesh>
   const cursorFollower = useRef({}) as RefObject<Mesh>


   const xMultiplier = 10
   const yMultiplier = 5
   
   const headX = useMemo(() => {
      if (currentView === 'home') return 2.8
      else if (currentView === 'works') return -2.8
      else return 0
   }, [currentView])

   useFrame(() => {
      const followerCoords = new Vector3(
         ((cursorCoordinates.x / canvasSize.width) - 0.5) * xMultiplier,
         -((cursorCoordinates.y / canvasSize.height) - 0.5) * yMultiplier,
         0
      )

      cursorFollower.current.position.copy(followerCoords)

      head.current.lookAt(cursorFollower.current.position)
   })

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollower} position={[0, 0, 4.8]} castShadow receiveShadow >
            {/* <dodecahedronGeometry args={[0.1, 1]} />
            <meshStandardMaterial color="blue" /> */}
         </mesh>

         {/* Avy head */}
         <Float speed={5} rotationIntensity={0.1} floatingRange={[-0.1, 0.1]} >
            <AvyHeadModel ref={head} position={[headX, 0, -6]} scale={1.8} />
         </Float>
      </>
   )

}
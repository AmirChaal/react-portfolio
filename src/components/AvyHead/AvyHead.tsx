import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { useGlobal } from "../../stores/global"
import { div } from "three/tsl"

export default function AvyHead() {
   const head = useRef(null)
   const cursorFollower = useRef(null)

   const { cursorCoordinates, canvasSize } = useGlobal()

   useFrame((state) => {
      const followerX = cursorCoordinates.x / canvasSize.width
      const followerY = cursorCoordinates.y / canvasSize.height
      const followerCoords = {
         x: followerX,
         y: followerY,
         z: 3
      }

      cursorFollower.current.position.x = (followerCoords.x - 0.5) * 0.4
      cursorFollower.current.position.y = (-followerCoords.y + 0.5) * 0.2
      cursorFollower.current.position.z = followerCoords.z

      head.current.lookAt(cursorFollower.current.position)
   })

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollower} position={[0, 0, 4.8]}  >
            <dodecahedronGeometry args={[0.1, 1]} />
            <meshStandardMaterial color="blue" />
         </mesh>

         {/* Avy head */}
         <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2} floatingRange={[-0.1, 0.1]} >
            <mesh ref={head} position={[0, 0, 2]}>
               <boxGeometry />
               <meshStandardMaterial color="red" />
            </mesh>
         </Float>
      </>
   )

}
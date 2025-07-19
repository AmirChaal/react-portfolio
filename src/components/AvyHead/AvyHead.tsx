import { Float, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, type RefObject } from "react"
import { useGlobal } from "../../stores/global"
import { Vector3, type Mesh } from "three"

export default function AvyHead() {
   const robavyModel = useGLTF('robavy.glb')

   const head = useRef({}) as RefObject<Mesh>
   const cursorFollower = useRef({}) as RefObject<Mesh>

   const { cursorCoordinates, canvasSize } = useGlobal()

   useFrame(() => {
      const followerX = cursorCoordinates.x / canvasSize.width
      const followerY = cursorCoordinates.y / canvasSize.height
      const followerCoords = new Vector3(
         followerX - 0.5,
         -followerY + 0.5,
         0.5 // edit this variable to ajust rotation intensity
      )


      console.log([...followerCoords])
      cursorFollower.current.position.copy(followerCoords)
      // cursorFollower.current.position.x = followerCoords.x
      // cursorFollower.current.position.y = followerCoords.y
      // cursorFollower.current.position.z = followerCoords.z

      head.current.lookAt(cursorFollower.current.position)
   })

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollower} position={[0, 0, 4.8]}  >
            {/* <dodecahedronGeometry args={[0.1, 1]} />
            <meshStandardMaterial color="blue" /> */}
         </mesh>

         {/* Avy head */}
         <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.2} floatingRange={[-0.1, 0.1]} >
            <primitive ref={head} object={robavyModel.scene} />;
            {/* <mesh ref={head} position={[0, 0, 2]}>
               <boxGeometry />
               <meshStandardMaterial color="red" />
            </mesh> */}
         </Float>
      </>
   )

}
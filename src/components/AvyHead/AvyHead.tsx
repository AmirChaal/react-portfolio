import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, type RefObject } from "react"
import { useGlobal } from "../../stores/global"
import { Vector3, type Mesh } from "three"
import AvyHeadModel from "./AvyHeadModel"
import { useParams } from "react-router"
import gsap from "gsap"

export default function AvyHead() {
   const { view } = useParams()
   const { cursorCoordinates, canvasSize } = useGlobal()
   const headRef = useRef({}) as RefObject<Mesh>
   const cursorFollower = useRef({}) as RefObject<Mesh>

   // HEAD POSITION
   // const headPosition = useMemo(() => {
   //    const position = new Vector3(0, 0, -6)
   //    if (view === 'home') position.x = 2.8
   //    else if (view === 'works') position.x = -2.8
   //    return position
   // }, [view])

   const prevViewRef = useRef(undefined) as RefObject<undefined | string>;
   useEffect(() => {
      if (!headRef.current || prevViewRef.current === view) return;

      const toLeft = gsap.to(headRef.current.position, { x: -2.5, duration: 1.5, paused: true, ease: "elastic.out(1,0.5)" });
      const toRight = gsap.to(headRef.current.position, { x: 2.5, duration: 1.5, paused: true, ease: "elastic.out(1,0.5)" });


      if (view === 'home') {
         console.log('playing toRight')
         toRight.play();
      } else if (view === 'works') {
         console.log('playing toLeft')
         toLeft.play();
      }

      // Cleanup
      return () => {
         toLeft.kill();
         toRight.kill();
      };
   }, [view]);


   // HEAD ROTATION
   const xMultiplier = 10
   const yMultiplier = 5
   useFrame(() => {
      const followerPosition = new Vector3(
         ((cursorCoordinates.x / canvasSize.width) - 0.5) * xMultiplier,
         -((cursorCoordinates.y / canvasSize.height) - 0.5) * yMultiplier,
         0
      )

      const effectiveFollowerPosition = cursorFollower.current.position.lerp(followerPosition, 0.075)

      cursorFollower.current.position.copy(effectiveFollowerPosition)

      headRef.current.lookAt(cursorFollower.current.position)
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
            <AvyHeadModel ref={headRef} position={[0, 0, -6]} scale={1.8} />
         </Float>
      </>
   )
}
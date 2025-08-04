import { Float } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, type RefObject } from "react"
import { useGlobal } from "../../stores/global"
import { Raycaster, Vector2, type Mesh } from "three"
import AvyHeadModel from "./AvyHeadModel"
import { useParams } from "react-router"
import gsap from "gsap"

export default function AvyHead() {
   const { view } = useParams()
   const { getNDC } = useGlobal()
   const headRef = useRef({}) as RefObject<Mesh>
   const cursorFollower = useRef({}) as RefObject<Mesh>
   const { camera } = useThree()

   // HEAD POSITION
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
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   useFrame((state, delta) => {
      const ndc = getNDC()
      const raycaster = new Raycaster()
      raycaster.setFromCamera(new Vector2(ndc.x, ndc.y), camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current)
      const currentPlaneIntersect = intersects[0].point

      const effectiveFollowerPosition = cursorFollower.current.position.lerp(currentPlaneIntersect, delta * 6)

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

         <mesh ref={receiverPlaneRef} position={[0, 0, -1]} visible={false}>
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial color="blue" transparent opacity={0.5} />
         </mesh>

         {/* Avy head */}
         <Float speed={5} rotationIntensity={0.1} floatingRange={[-0.1, 0.1]} >
            <AvyHeadModel ref={headRef} position={[0, 0, -6]} scale={1.6} />
         </Float>
      </>
   )
}
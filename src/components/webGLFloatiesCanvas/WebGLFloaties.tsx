import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Mesh, MeshBasicMaterial, Raycaster, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLPointerIndicator from "./WebGLPointerIndicator";
import WebGLFloatiesStirrer from "./WebGLFloatiesStirrer";
import WebGLFloatiesContainer from "./WebGLFloatiesContainer";
import { getCursor3DPosition } from "../../functions/3d";

export default function WebGLFloaties({ focused }: { focused: boolean }) {
   /**
    * Setup
    */
   const { getNDC } = useGlobal()
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const receiverPlaneRef = useRef<Mesh>(null)
   const cursorEnteredViewport = useRef(false)
   const { camera } = useThree()

   const borderBoxesRef = useRef<RapierRigidBody | null>(null)

   /**
    * Mouse entering detection
    */
   useEffect(() => {
      const mouseMoveFunction = () => {
         if (cursorEnteredViewport.current === false) cursorEnteredViewport.current = true
      }

      document.addEventListener('mousemove', mouseMoveFunction);

      return () => document.removeEventListener('mousemove', mouseMoveFunction)
   }, [])

   /**
    * Spawning cursor indicator and stirrer
    */
   const [stirrerVisible, setStirrerVisible] = useState(false)
   const [pointerIndicatorVisible, setPointerIndicatorVisible] = useState(false)
   useEffect(() => {
      let stirrerTimouetId: null | number = null
      const interactivity = cursorEnteredViewport.current === true && focused === true
      if (interactivity) {
         setPointerIndicatorVisible(true)
         stirrerTimouetId = setTimeout(() => {
            setStirrerVisible(true)
         }, 250);
      } else {
         setStirrerVisible(false)
         setPointerIndicatorVisible(false)
      }

      return () => {
         if (stirrerTimouetId != null) clearTimeout(stirrerTimouetId)
      }
   }, [cursorEnteredViewport.current, focused])

   /**
    * useFrame
    */
   const cursor3DPositionRef = useRef<Vector3 | null>(null)
   const raycasterRef = useRef(new Raycaster())
   useFrame((state, delta) => {
      if (receiverPlaneRef.current) {
         cursor3DPositionRef.current = getCursor3DPosition(getNDC, receiverPlaneRef.current, raycasterRef.current, camera)
      }
   })

   return (
      <>
         <RigidBody ref={borderBoxesRef} canSleep={false} type='fixed' restitution={1} >
            <CuboidCollider args={[25, 2, 3]} position={[0, -10.5, 0]} />
            <CuboidCollider args={[25, 2, 3]} position={[0, 10.5, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[21, 0, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[-20, 0, 0]} />
         </RigidBody>

         <WebGLFloatiesStirrer visible={stirrerVisible} cursor3DPosition={cursor3DPositionRef.current} />

         <WebGLFloatiesContainer borderBoxes={borderBoxesRef.current} />

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         <WebGLPointerIndicator visible={pointerIndicatorVisible} cursor3DPosition={cursor3DPositionRef.current} />
      </>
   )
}




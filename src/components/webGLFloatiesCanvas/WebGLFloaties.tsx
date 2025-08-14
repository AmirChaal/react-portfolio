import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Mesh, MeshBasicMaterial, Raycaster, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLPointerIndicator from "./WebGLPointerIndicator";
import WebGLFloatiesStirrer from "./WebGLFloatiesStirrer";
import WebGLFloatiesContainer from "./WebGLFloatiesContainer";

export default function WebGLFloaties({ focused }: { focused: boolean }) {
   /**
    * Setup
    */
   const { getNDC } = useGlobal()
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const cursorEnteredViewport = useRef(false)
   const { camera } = useThree()

   const [borderBoxes, setBorderBoxes] = useState<RapierRigidBody | null>(null);

   /**
    * Mouse entering detection
    */
   useEffect(() => {
      document.addEventListener('mousemove', () => {
         if (cursorEnteredViewport.current === false) cursorEnteredViewport.current = true
      });
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
   const elapsedTimeRef = useRef(0)
   const [cursor3DPosition, setCursor3DPosition] = useState(null as null | Vector3)
   const raycasterRef = useRef(new Raycaster())
   useFrame((state, delta) => {
      elapsedTimeRef.current += delta
      const ndc = getNDC()

      raycasterRef.current.setFromCamera(ndc, camera)
      const intersects = raycasterRef.current.intersectObject(receiverPlaneRef.current, true);
      if (intersects.length > 0) setCursor3DPosition(intersects[0].point)
      else setCursor3DPosition(null)
   });

   return (
      <>
         <RigidBody ref={(newRef => setBorderBoxes(newRef))} canSleep={false} type='fixed' restitution={1} >
            <CuboidCollider args={[25, 2, 3]} position={[0, -10.5, 0]} />
            <CuboidCollider args={[25, 2, 3]} position={[0, 10.5, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[21, 0, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[-20, 0, 0]} />
         </RigidBody>

         <WebGLFloatiesStirrer visible={stirrerVisible} cursor3DPosition={cursor3DPosition} />

         <WebGLFloatiesContainer borderBoxes={borderBoxes} />

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         <WebGLPointerIndicator visible={pointerIndicatorVisible} cursor3DPosition={cursor3DPosition} />
      </>
   )
}




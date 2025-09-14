import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RapierRigidBody, RigidBody, type CuboidArgs } from "@react-three/rapier";
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
   const { getNDC, update, deviceSize, biggestFloatySize } = useGlobal()
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
   const firstFrameDrawn = useRef(false);
   const cursor3DPositionRef = useRef<Vector3 | null>(null)
   const raycasterRef = useRef(new Raycaster())
   useFrame((state, delta) => {
      if (!firstFrameDrawn.current) {
         firstFrameDrawn.current = true;
         update({ floatiesCanvasFirstFrameGenerated: true })
      }

      if (receiverPlaneRef.current) {
         cursor3DPositionRef.current = getCursor3DPosition(getNDC, receiverPlaneRef.current, raycasterRef.current, camera)
      }
   })

   // Border boxes dimensions
   const deviceTo3DWorldRatio = 0.00832
   const xScreenLimit = deviceSize.width * deviceTo3DWorldRatio
   const yScreenLimit = deviceSize.height * deviceTo3DWorldRatio
   const spaceForBiggestFloaty = (biggestFloatySize ?? 0) * 2
   const floatySpawningSpace = (biggestFloatySize ?? 0) * 4

   const borderBoxTopDimensions = [xScreenLimit / 2 + 10, 3, 3] as CuboidArgs
   const borderBoxTopPosition = [0, yScreenLimit + borderBoxTopDimensions[1] + spaceForBiggestFloaty, 0] as any

   const borderBoxRightDimensions = [3, yScreenLimit / 2 + 10, 3] as CuboidArgs
   const borderBoxRightPosition = [xScreenLimit + borderBoxRightDimensions[0] + spaceForBiggestFloaty + floatySpawningSpace, 0, 0] as any

   const borderBoxBottomDimensions = [xScreenLimit / 2 + 10, 3, 3] as CuboidArgs
   const borderBoxBottomPosition = [0, -(yScreenLimit + borderBoxTopDimensions[1] + spaceForBiggestFloaty), 0] as any

   const borderBoxLeftDimensions = [3, yScreenLimit / 2 + 10, 3] as CuboidArgs
   const borderBoxLeftPosition = [-(xScreenLimit + borderBoxRightDimensions[0] + spaceForBiggestFloaty), 0, 0] as any

   return (
      <>
         <RigidBody ref={borderBoxesRef} canSleep={false} type="fixed" restitution={1}>
            <CuboidCollider args={borderBoxTopDimensions} position={borderBoxTopPosition} />
            <CuboidCollider args={borderBoxRightDimensions} position={borderBoxRightPosition} />
            <CuboidCollider args={borderBoxBottomDimensions} position={borderBoxBottomPosition} />
            <CuboidCollider args={borderBoxLeftDimensions} position={borderBoxLeftPosition} />
         </RigidBody>

         <WebGLFloatiesStirrer visible={stirrerVisible} cursor3DPosition={cursor3DPositionRef.current} />

         <WebGLFloatiesContainer xScreenLimit={xScreenLimit} yScreenLimit={yScreenLimit} floatySpawningSpace={floatySpawningSpace} borderBoxes={borderBoxesRef.current} />

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         <WebGLPointerIndicator visible={pointerIndicatorVisible} cursor3DPosition={cursor3DPositionRef.current} />
      </>
   )
}


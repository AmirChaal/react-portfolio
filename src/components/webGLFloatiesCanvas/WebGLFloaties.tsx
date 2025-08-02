import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, Raycaster, SphereGeometry, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";

export default function WebGLFloaties() {
   // Debug

   const boxGeometryRef = useRef(new BoxGeometry())
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const sphereGeometryRef = useRef(new SphereGeometry(1, 8, 6))
   const particleMaterialRef = useRef(new MeshBasicMaterial({ color: '#f2f2f2', toneMapped: false }))
   const stirrerRef = useRef(null) as any
   const { getNDC, tonicColor, } = useGlobal()

   const { camera } = useThree()

   // Textures
   const floatiesTextures = useLoader(TextureLoader, [
      "/floaties-textures/at.png",
      // "/floaties-textures/and.png",
      // "/floaties-textures/dollar.png",
      // "/floaties-textures/hash.png",
      // "/floaties-textures/less.png",
      // "/floaties-textures/percent.png",
      // "/floaties-textures/question.png",
   ])
   floatiesTextures.map(te => te.minFilter = NearestFilter)

   // Floaties
   const floatiesCount = 2
   const [floatiesArray, setFloatiesArray] = useState([])
   const addFloaty = (floaty: any) => { setFloatiesArray([...floatiesArray, floaty]) }

   useEffect(() => {
      // if (floatiesArray.length === floatiesCount) { console.log('aborting'); return } else { console.log('continuing') }
      console.log('computing...')
      if (floatiesArray.length === floatiesCount) {
         console.log("complete :", floatiesArray.length, floatiesCount)
      } else {
         console.log('nope :', floatiesArray.length, floatiesCount)
      }

      // floatiesArrayRef.current[0].addForce(new Vector3(1, 0, 0))
      // setInterval(() => {
      //    floatiesArrayRef.current.forEach(fl => {
      //       fl.addForce(new Vector3(1, 0, 0))
      //    })
      // }, 1000)
   }, [floatiesArray, floatiesCount])

   // Raycaster
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const pointerIndicatorRef = useRef({}) as RefObject<Mesh>
   useFrame((state, delta) => {
      const ndc = getNDC()

      // Get intersection of camera ray with receiver plane
      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current, true);
      const cursorPosition = intersects[0].point

      // Cursor indicator
      pointerIndicatorRef.current.position.copy(new Vector3(cursorPosition.x, cursorPosition.y, 3))

      if (intersects.length > 0 && stirrerRef.current != null) {
         const stirrerPosition = stirrerRef.current.translation()
         const toCursorVector = new Vector3().subVectors(cursorPosition, stirrerPosition)
         const toCursorForce = toCursorVector.multiplyScalar(700 * delta)
         toCursorForce.clampLength(0, 30)
         stirrerRef.current.setLinvel(toCursorForce)
      }
   });

   return (
      <Physics>
         <RigidBody type="fixed" restitution={1} >
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, -9.1, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, 9.1, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[-17.5, 0, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[17.5, 0, 0]} />
         </RigidBody>

         <RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={50} restitution={0} />
            <mesh material={new MeshBasicMaterial({ color: tonicColor })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>

         {[...Array(floatiesCount)].map((_, i) => {
            return <WebGLFloaty key={i} addFloaty={addFloaty} textures={floatiesTextures} geometry={sphereGeometryRef.current} material={particleMaterialRef.current} />
         })}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
            {/* <meshBasicMaterial color="blue" /> */}
         </mesh>

         <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>
      </Physics>
   )
}
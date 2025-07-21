import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshStandardMaterial, Plane, Raycaster, SphereGeometry, Vector2, Vector3 } from "three";
import { useGlobal } from "../../stores/global";

export default function WebGLFloaties() {
   const boxGeometryRef = useRef(new BoxGeometry())
   const sphereGeometryRef = useRef(new SphereGeometry(0.5))
   const particleMaterialRef = useRef(new MeshStandardMaterial({ color: 'blue' }))
   const stirrerRef = useRef(null) as RefObject<RapierRigidBody | null>
   const { cursorCoordinates, canvasSize } = useGlobal()

   const { camera } = useThree()

   // Raycaster
   const receiverPlaneRef = useRef(null) as any
   useFrame(() => {
      const xPercent = cursorCoordinates.x / canvasSize.width
      const yPercent = cursorCoordinates.y / canvasSize.height

      const ndc = new Vector2(xPercent * 2 - 1, yPercent * 2 - 1)

      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObjects(stirrerRef.current)
      console.log(ndc)
   });

   return (
      <Physics debug>
         <RigidBody type="fixed">
            <mesh geometry={boxGeometryRef.current} scale={[31, 0.5, 0.5]} position={[0, -7, 0]} />
            <mesh geometry={boxGeometryRef.current} scale={[31, 0.5, 0.5]} position={[0, 7, 0]} />
            <mesh geometry={boxGeometryRef.current} scale={[0.5, 15, 0.5]} position={[-15, 0, 0]} />
            <mesh geometry={boxGeometryRef.current} scale={[0.5, 15, 0.5]} position={[15, 0, 0]} />
         </RigidBody>

         <RigidBody ref={stirrerRef} type="kinematicPosition" colliders="trimesh" rotation={[Math.PI / 2, 0, 0]} position={[3, 3, 0]}>
            <mesh >
               <cylinderGeometry />
            </mesh>
         </RigidBody>

         {[...Array(100)].map((_, i) => {
            return <RigidBody key={i} type="dynamic" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
               <mesh key={i} geometry={sphereGeometryRef.current} material={particleMaterialRef.current} position={[0, 0, 0]} />
            </RigidBody>
         })}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]}>
            <planeGeometry args={[31, 15]} />
            <meshBasicMaterial color="blue" />
         </mesh>
      </Physics>
   )
}
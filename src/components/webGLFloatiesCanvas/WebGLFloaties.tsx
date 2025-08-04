import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { BallCollider, Physics, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, Raycaster, SphereGeometry, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";

export default function WebGLFloaties() {
   // Setup
   const boxGeometryRef = useRef(new BoxGeometry())
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const sphereGeometryRef = useRef(new SphereGeometry(1, 8, 6))
   const particleMaterialRef = useRef(new MeshBasicMaterial({ color: '#f2f2f2', toneMapped: false }))
   const stirrerRef = useRef(null) as any
   const { getNDC, tonicColor, } = useGlobal()
   const { world } = useRapier()
   const rigidBodiesToRemoveRef = useRef<RapierRigidBody[]>([])
   const borderBoxesRef = useRef<RapierRigidBody | null>(null)
   const { camera } = useThree()

   // Textures
   const floatiesTextures = useLoader(TextureLoader, [
      "/floaties-textures/at.png",
      "/floaties-textures/and.png",
      "/floaties-textures/dollar.png",
      "/floaties-textures/hash.png",
      "/floaties-textures/less.png",
   ])
   floatiesTextures.map(te => te.minFilter = NearestFilter)

   // Floaties
   const [floatiesCount, setFloatiesCount] = useState(100)
   const floatiesSpawnAtRef = useRef<'random' | 'edge'>('random')
   const onFloatyRemove = () => {
      console.log('removed')
      setFloatiesCount(prev => prev + 1)
   }
   useEffect(() => {
      floatiesSpawnAtRef.current = 'edge'
   }, [])

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

      // Make stirrer follow cursor
      if (intersects.length > 0 && stirrerRef.current != null) {
         const stirrerPosition = stirrerRef.current.translation()
         const toCursorVector = new Vector3().subVectors(cursorPosition, stirrerPosition)
         const toCursorForce = toCursorVector.multiplyScalar(700 * delta)
         toCursorForce.clampLength(0, 30)
         stirrerRef.current.setLinvel(toCursorForce)
      }
   });

   return (
      <>
         <RigidBody ref={borderBoxesRef} type="fixed" restitution={1} >
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, -10.1, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, 10.1, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[-18.5, 0, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[18.5, 0, 0]} />
         </RigidBody>

         <RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={50} restitution={0} />
            <mesh material={new MeshBasicMaterial({ color: tonicColor })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>

         {
            [...Array(floatiesCount)].map((_, i) => {
               return <WebGLFloaty key={i} spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxesRef.current!} textures={floatiesTextures} />
            })
         }

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
            {/* <meshBasicMaterial color="blue" /> */}
         </mesh>

         <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>
      </>
   )
}
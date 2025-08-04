import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { BallCollider, Physics, RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, NearestFilter, PlaneGeometry, Raycaster, SphereGeometry, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";

export default function WebGLFloaties() {
   // Setup
   const boxGeometryRef = useRef(new BoxGeometry())
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const stirrerRef = useRef(null) as any
   const { getNDC, tonicColor } = useGlobal()
   const borderBoxesRef = useRef<RapierRigidBody | null>(null)
   const { camera } = useThree()
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const pointerIndicatorRef = useRef({}) as RefObject<Mesh>

   // Textures
   // Big textures
   const bigFloatyGeometryRef = useRef(new PlaneGeometry(2, 2))
   const textures = useLoader(TextureLoader, [
      "/floaties-textures/at.png",
      "/floaties-textures/and.png",
      "/floaties-textures/dollar.png",
      "/floaties-textures/hash.png",
      "/floaties-textures/less.png",
   ])
   useEffect(() => {
      textures.forEach(tex => {
         tex.minFilter = NearestFilter
         tex.colorSpace = SRGBColorSpace
      })
   }, [textures])
   const bigFloatyMaterials = useMemo(() => (
      textures.map(tex => new MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true, }))
   ), [textures])

   // Small textures
   const smallFloatyTextures = useLoader(TextureLoader, [
      "/floaties-textures/dot.png",
      "/floaties-textures/comma.png",
   ])
   smallFloatyTextures.map(te => te.minFilter = NearestFilter)
   const smallFloatyMaterials = smallFloatyTextures.map(texture => new MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true }))

   // Floaties
   const initialFloatiesCount = 150
   const [floatyKeys, setFloatyKeys] = useState(Array.from({ length: initialFloatiesCount }, (_, i) => i))
   const floatyKeyCounterRef = useRef(initialFloatiesCount)

   const floatiesSpawnAtRef = useRef<'random' | 'edge'>('random')
   useEffect(() => {
      floatiesSpawnAtRef.current = 'edge'
   }, [])

   const onFloatyRemove = (key: number) => {
      setFloatyKeys(prevKeys =>
         prevKeys.map(k => (k === key ? floatyKeyCounterRef.current++ : k))
      )
   }

   useFrame((state, delta) => {
      const ndc = getNDC()

      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current, true);
      if (intersects.length === 0) return
      const cursorPosition = intersects[0].point

      // Cursor indicator
      pointerIndicatorRef.current.position.copy(new Vector3(cursorPosition.x, cursorPosition.y, 3))

      // Stirrer follow
      if (stirrerRef.current != null) {
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

         {floatyKeys.map((key) => (
            <WebGLFloaty key={key} uniqueKey={key} spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxesRef.current!} bigFloatyMaterials={bigFloatyMaterials} smallFloatyMaterials={smallFloatyMaterials} bigFloatyGeometryRef={bigFloatyGeometryRef.current} />
         ))}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>
      </>
   )
}

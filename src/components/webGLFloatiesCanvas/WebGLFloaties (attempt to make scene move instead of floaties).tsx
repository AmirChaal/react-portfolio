import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, Raycaster, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";
import { useTexture } from "@react-three/drei";

export default function WebGLFloaties() {
   /**
    * Setup
    */
   const boxGeometryRef = useRef(new BoxGeometry())
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const stirrerRef = useRef({} as RapierRigidBody)
   const { getNDC, tonicColor } = useGlobal()
   const borderBoxesRef = useRef({}) as RefObject<RapierRigidBody>
   const { camera } = useThree()
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const pointerIndicatorRef = useRef({}) as RefObject<Mesh>
   const sceneCenterRef = useRef({} as RapierRigidBody)

   /**
    * Floaties
    */
   // Geometries
   const planeGeometryRef = useRef(new PlaneGeometry(0.75, 0.75))

   // Materials
   const globalTextureLoader = new TextureLoader()
   const useMaterials = (paths: string[]) => {
      const materials = useMemo(() => {
         return paths.map(path => {
            const tex = globalTextureLoader.load(path)
            tex.minFilter = NearestFilter
            tex.colorSpace = SRGBColorSpace

            return new MeshBasicMaterial({
               map: tex,
               toneMapped: false,
               transparent: true
            })
         })
      }, [paths])

      return materials
   }
   const bigFloatyMaterialsRef = useRef(useMaterials([
      "/floaties-textures/at.png",
      "/floaties-textures/and.png",
      "/floaties-textures/dollar.png",
      "/floaties-textures/hash.png",
      "/floaties-textures/less.png",
   ]))
   const mediumFloatyMaterialsRef = useRef(useMaterials([
      "/floaties-textures/n.png",
      "/floaties-textures/x.png",
      "/floaties-textures/e.png",
      "/floaties-textures/s.png",
      "/floaties-textures/o.png",
   ]))
   const smallFloatyMaterialsRef = useRef(useMaterials([
      "/floaties-textures/dot.png",
      "/floaties-textures/comma.png",
   ]))
   const floatyMaterials = useMemo(() => ({
      small: smallFloatyMaterialsRef.current,
      medium: mediumFloatyMaterialsRef.current,
      big: bigFloatyMaterialsRef.current
   }), [smallFloatyMaterialsRef.current, mediumFloatyMaterialsRef.current, bigFloatyMaterialsRef.current])

   // Spawn & Despawn management
   const initialFloatiesCount = 350 // Good number for build version is 500
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

   /**
    * useFrame
    */
   const sceneCenterPositionRef = useRef(new Vector3(0, 0, 0))
   useFrame((state, delta) => {
      const ndc = getNDC()

      // Cursor 
      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current, true);
      const intersectionOnReceiverPlane = intersects[0].point ? intersects[0].point : null


      // Stirrer follow
      // if (stirrerRef.current.translation != null && intersectionOnReceiverPlane != null) {
      //    const stirrerPosition = stirrerRef.current.translation()
      //    const toCursorVector = new Vector3().subVectors(intersectionOnReceiverPlane, stirrerPosition)
      //    const cappedDelta = Math.min(1 / 30, delta)
      //    const toCursorForce = toCursorVector.multiplyScalar(cappedDelta * 1000)
      //    toCursorForce.clampLength(0, 30)
      //    stirrerRef.current.setLinvel(toCursorForce, true)
      // }

      /**
       * Scene translation
       */
      // Translation of center of scene rigidbody
      sceneCenterPositionRef.current.add(new Vector3(2 * delta, 0, 0))

      // Borders
      if (borderBoxesRef.current.setNextKinematicTranslation != null) {
         borderBoxesRef.current.setNextKinematicTranslation(sceneCenterPositionRef.current)
      }

      // Camera
      state.camera.position.copy(new Vector3(borderBoxesRef.current.translation().x, borderBoxesRef.current.translation().y, 10))

      // Receiver plane
      receiverPlaneRef.current.position.copy(borderBoxesRef.current.translation())

      // Stirrer
      stirrerRef.current.setTranslation(sceneCenterPositionRef.current, true)

      // Cursor indicator
      if (intersectionOnReceiverPlane != null) {
         pointerIndicatorRef.current.position.copy(new Vector3(intersectionOnReceiverPlane.x, intersectionOnReceiverPlane.y, 3))
      }
   });

   return (
      <>
         <RigidBody ref={sceneCenterRef} colliders={false} type="kinematicPosition">
            <sphereGeometry />
            <meshBasicMaterial color="red" />
         </RigidBody>

         <RigidBody ref={borderBoxesRef} canSleep={false} type="kinematicPosition" restitution={1} >
            <CuboidCollider args={[25, 2, 3]} position={[0, -10.5, 0]} />
            <CuboidCollider args={[25, 2, 3]} position={[0, 10.5, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[21, 0, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[-20, 0, 0]} />
         </RigidBody>

         <RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={0} restitution={0} />
            <mesh material={new MeshBasicMaterial({ color: tonicColor })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>

         {floatyKeys.map((key) => (
            <WebGLFloaty key={key} uniqueKey={key} spawningMode="strips" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxesRef.current!} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} />
         ))}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[40, 19]} />
            <meshBasicMaterial color="blue" transparent={true} opacity={0.1} />
         </mesh>

         <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>
      </>
   )
}

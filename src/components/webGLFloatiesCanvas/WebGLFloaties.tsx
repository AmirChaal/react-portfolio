import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, Raycaster, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";
import gsap from "gsap";

export default function WebGLFloaties() {
   /**
    * Setup
    */
   const { getNDC, tonicColor } = useGlobal()
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const cursorEnteredViewport = useRef(false)
   const { camera } = useThree()

   /**
    * Floaties
    */
   // Geometries
   const [borderBoxes, setBorderBoxes] = useState<RapierRigidBody | null>(null);
   const planeGeometryRef = useRef(new PlaneGeometry(0.75, 0.75))

   // Materials
   const { textures } = useGlobal()
   const useMaterials = (textureGroup: string) => {
      const materials = useMemo(() => {
         return textures[textureGroup].map(texture => {
            texture.minFilter = NearestFilter
            texture.colorSpace = SRGBColorSpace

            return new MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true })
         })
      }, [textureGroup])

      return materials
   }
   const bigFloatyMaterialsRef = useRef(useMaterials('bigFloatyTextures'));
   const mediumFloatyMaterialsRef = useRef(useMaterials('mediumFloatyTextures'));
   const smallFloatyMaterialsRef = useRef(useMaterials('smallFloatyTextures'));
   const floatyMaterials = useMemo(() => ({
      small: smallFloatyMaterialsRef.current,
      medium: mediumFloatyMaterialsRef.current,
      big: bigFloatyMaterialsRef.current
   }), [])



   // Spawn & Despawn management
   const initialFloatiesCount = 350 // Good number for build version is 350-500
   const [floatyKeys, setFloatyKeys] = useState(Array.from({ length: initialFloatiesCount }, (_, i) => i))
   const floatyKeyCounterRef = useRef(initialFloatiesCount)

   const floatiesSpawnAtRef = useRef<'random' | 'edge'>('random')
   useEffect(() => {
      if (borderBoxes != null) {
         floatiesSpawnAtRef.current = 'edge'
      }
   }, [borderBoxes])

   const onFloatyRemove = (key: number) => {
      setFloatyKeys(prevKeys =>
         prevKeys.map(k => (k === key ? floatyKeyCounterRef.current++ : k))
      )
   }

   /**
    * Stirrer
    */
   const stirrerRef = useRef({} as RapierRigidBody)
   const stirrerRadiusRef = useRef(0)
   const stirrerVisibleRef = useRef(false)
   const stirrerMeshRef = useRef(null as null | Mesh)
   const stirrerFollowVectorMultiplier = useRef(0)
   const spawnStirrer = () => {
      setTimeout(() => {
         stirrerVisibleRef.current = true
         gsap.to(stirrerRadiusRef, { current: 1, duration: 1, ease: "elastic.out(1,0.4)" })
         gsap.to(stirrerFollowVectorMultiplier, { current: 1, duration: 1, ease: "power2.in" })
      }, 250);
   }

   // Pointer indicator
   const pointerIndicatorRef = useRef(null as null | Mesh) as RefObject<Mesh>
   const pointerIndicatorVisibleRef = useRef(false)
   const pointerIndicatorMeshRadius = useRef(0)
   const spawnIndicator = () => {
      pointerIndicatorVisibleRef.current = true
      gsap.to(pointerIndicatorMeshRadius, { current: 0.2, duration: 1, ease: "elastic.out(1.5,0.2)" })
   }

   useEffect(() => {
      if (cursorEnteredViewport.current === true) {
         spawnStirrer()
         spawnIndicator()
      }
   }, [cursorEnteredViewport.current])

   /**
    * useFrame
    */
   const elapsedTimeRef = useRef(0)
   useFrame((state, delta) => {
      elapsedTimeRef.current += delta
      const ndc = getNDC()

      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current, true);
      if (intersects.length === 0) return
      const cursorPosition = intersects[0].point

      // Cursor indicator
      if (pointerIndicatorRef.current != null) {
         pointerIndicatorRef.current.position.copy(new Vector3(cursorPosition.x, cursorPosition.y, 3))
      }

      // Stirrer radius
      if (stirrerRef.current != null && stirrerMeshRef.current != null) {
         stirrerMeshRef.current.scale.x = stirrerRadiusRef.current
         stirrerMeshRef.current.scale.z = stirrerRadiusRef.current
      }

      // Pointer indictaor radius
      if (pointerIndicatorRef.current != null) {
         pointerIndicatorRef.current.scale.x = pointerIndicatorMeshRadius.current
         pointerIndicatorRef.current.scale.y = pointerIndicatorMeshRadius.current
      }

      // Stirrer follow
      if (stirrerRef.current?.translation != null) {
         const stirrerPosition = stirrerRef.current.translation()
         const toCursorVector = new Vector3().subVectors(cursorPosition, stirrerPosition)
         const cappedDelta = Math.min(1 / 30, delta)
         const toCursorForce = toCursorVector.multiplyScalar(cappedDelta * 1000)
         toCursorForce.clampLength(0, 30 * stirrerFollowVectorMultiplier.current)
         stirrerRef.current.setLinvel(toCursorForce, false)
      }
   });

   useEffect(() => {
      document.addEventListener('mousemove', () => {
         if (cursorEnteredViewport.current === false) cursorEnteredViewport.current = true
      });
   }, [])

   return (
      <>
         <RigidBody ref={(newRef => setBorderBoxes(newRef))} canSleep={false} type='fixed' restitution={1} >
            <CuboidCollider args={[25, 2, 3]} position={[0, -10.5, 0]} />
            <CuboidCollider args={[25, 2, 3]} position={[0, 10.5, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[21, 0, 0]} />
            <CuboidCollider args={[2, 25, 3]} position={[-20, 0, 0]} />
         </RigidBody>

         {cursorEnteredViewport.current && <RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={0} restitution={0} />
            <mesh ref={stirrerMeshRef} material={new MeshBasicMaterial({ color: tonicColor })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>}

         {floatyKeys.map((key) => (
            borderBoxes && <WebGLFloaty key={key} uniqueKey={key} spawningMode="strips" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxes} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} />
         ))}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         {pointerIndicatorVisibleRef.current && <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>}
      </>
   )
}




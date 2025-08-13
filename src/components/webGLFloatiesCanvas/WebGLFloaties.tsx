import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, CuboidCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, Raycaster, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";
import gsap from "gsap";
import WebGLPointerIndicator from "./WebGLPointerIndicator";
import WebGLFloatiesStirrer from "./WebGLFloatiesStirrer";

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
      if (cursorEnteredViewport.current === true) {
         setPointerIndicatorVisible(true)
         setTimeout(() => {
            setStirrerVisible(true)
         }, 250);
      }
   }, [cursorEnteredViewport.current])

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

         {floatyKeys.map((key) => (
            borderBoxes && <WebGLFloaty key={key} uniqueKey={key} spawningMode="strips" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxes} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} />
         ))}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
         </mesh>

         <WebGLPointerIndicator visible={pointerIndicatorVisible} cursor3DPosition={cursor3DPosition} />
      </>
   )
}




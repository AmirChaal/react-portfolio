import { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { MeshBasicMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";

export default function WebGLFloatiesContainer({ borderBoxes }: { borderBoxes: RapierRigidBody | null }) {
   /**
    * Floaties
    */
   // Geometries
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

   return (
      <>
         {floatyKeys.map((key) => (
            borderBoxes && <WebGLFloaty key={key} uniqueKey={key} spawningMode="strips" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxes} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} />
         ))}
      </>
   )
}

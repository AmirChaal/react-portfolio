import { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { MeshBasicMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace, Texture } from "three";
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
   const floatiesBigTextures = [textures.floatyAt, textures.floatyAnd, textures.floatyDollar, textures.floatyHash, textures.floatyLess]
   const floatiesMediumTextures = [textures.floatyN, textures.floatyX, textures.floatyE, textures.floatyS, textures.floatyO]
   const floatiesSmallTextures = [textures.floatyDot, textures.floatyComma]
   const useMaterials = (textures: Texture[]) => {
      const materials = useMemo(() => {
         return textures.map(texture => {
            texture.minFilter = NearestFilter
            texture.colorSpace = SRGBColorSpace

            return new MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true })
         })
      }, [textures])

      return materials
   }
   const bigFloatyMaterialsRef = useRef(useMaterials(floatiesBigTextures));
   const mediumFloatyMaterialsRef = useRef(useMaterials(floatiesMediumTextures));
   const smallFloatyMaterialsRef = useRef(useMaterials(floatiesSmallTextures));
   const floatyMaterials = useMemo(() => ({
      small: smallFloatyMaterialsRef.current,
      medium: mediumFloatyMaterialsRef.current,
      big: bigFloatyMaterialsRef.current
   }), [])

   // Spawn & Despawn management
   const initialFloatiesCount = 100
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
            borderBoxes && <WebGLFloaty key={key} globalScale={1.5} uniqueKey={key} spawningMode="strips" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxes} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} />
         ))}
      </>
   )
}

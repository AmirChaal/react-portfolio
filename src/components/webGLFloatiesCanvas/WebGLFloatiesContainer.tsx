import { RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { MeshBasicMaterial, NearestFilter, PlaneGeometry, SRGBColorSpace, Texture } from "three";
import { useGlobal } from "../../stores/global";
import WebGLFloaty from "./WebGLFloaty";

export default function WebGLFloatiesContainer({ xScreenLimit, yScreenLimit, borderBoxes, floatySpawningSpace, globalFloatyScale, floatyScales }: { borderBoxes: RapierRigidBody | null, xScreenLimit: number, yScreenLimit: number, floatySpawningSpace: number, globalFloatyScale: number, floatyScales: Record<string, number> }) {
   /**
    * Floaties
    */
   // Geometries
   const planeGeometryRef = useRef(new PlaneGeometry(0.75, 0.75))

   // Materials
   const { textures, deviceSize } = useGlobal()
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
   const floatyDensity = 0.0001;

   // State
   const [floatyKeys, setFloatyKeys] = useState<number[]>([]);
   const floatyKeyCounterRef = useRef(0);

   // Recalculate floaties whenever device size changes
   useEffect(() => {
      let desiredCount = Math.round(deviceSize.width * deviceSize.height * floatyDensity);

      // Cap the max number of floaties
      desiredCount = Math.min(desiredCount, 200);

      setFloatyKeys(prevKeys => {
         if (desiredCount > prevKeys.length) {
            // Add new floaties
            const newKeys = Array.from(
               { length: desiredCount - prevKeys.length },
               () => floatyKeyCounterRef.current++
            );
            return [...prevKeys, ...newKeys];
         } else if (desiredCount < prevKeys.length) {
            // Remove excess floaties
            return prevKeys.slice(0, desiredCount);
         }
         return prevKeys;
      });
   }, [deviceSize.width, deviceSize.height]);


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
            borderBoxes != null && <WebGLFloaty xScreenLimit={xScreenLimit} yScreenLimit={yScreenLimit} floatySpawningSpace={floatySpawningSpace} key={key} globalScale={1.5} uniqueKey={key} spawningMode="everywhere" spawnAt={floatiesSpawnAtRef.current} onRemove={onFloatyRemove} edgeBody={borderBoxes} materials={floatyMaterials} planeGeometry={planeGeometryRef.current} globalFloatyScale={globalFloatyScale} floatyScales={floatyScales} />
         ))}
      </>
   )
}

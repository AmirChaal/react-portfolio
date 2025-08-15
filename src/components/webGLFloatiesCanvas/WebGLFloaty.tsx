import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Color, Material, PlaneGeometry, Texture, Vector3 } from "three";
import { getRandomPosition } from "../../functions/3d";
import { useGlobal } from "../../stores/global";

const floatySizes = ['small', 'medium', 'big'] as const
type FloatySize = typeof floatySizes[number]

const spawningMods = ['strips', 'everywhere'] as const
type SpawningMod = typeof spawningMods[number]

export default function WebGLFloaty({ spawningMode, uniqueKey, edgeBody, onRemove, spawnAt, materials, planeGeometry }: {
   readonly spawningMode: SpawningMod,
   readonly uniqueKey: number,
   readonly edgeBody: RapierRigidBody,
   readonly onRemove: (key: number) => void,
   readonly spawnAt: 'random' | 'edge'
   readonly materials: { small: Material[], medium: Material[], big: Material[] }
   readonly planeGeometry: PlaneGeometry
}) {
   const { floatiesColor } = useGlobal()
   const bodyRef = useRef(null) as RefObject<RapierRigidBody | null>

   // Collision detection
   const removeFloaty = () => { onRemove(uniqueKey) }
   const onCollisionEnter = (collision: any) => {
      const otherBody = collision.other.rigidBody
      if (otherBody.handle !== edgeBody.handle) return
      removeFloaty()
   }

   // Size selection
   const getSize = () => {
      const random = Math.random();
      let size
      if (random < 0) size = 'small' as const
      else if (random < 0.5) size = 'medium' as const
      else size = 'big' as const
      return size
   }
   const sizeRef = useRef<FloatySize>(getSize())

   // Position
   const getFloatyPosition = () => {
      if (spawnAt === 'random' && spawningMode === 'everywhere') return getRandomPosition(8, 18, -8, -17, 0, 0)
      else if (spawnAt === 'edge' && spawningMode === 'everywhere') return getRandomPosition(8, 18, -8, 17, 0, 0)
      else if (spawnAt === 'random' && spawningMode === 'strips') {
         const topPart = Math.random() < 0.5
         if (topPart) return getRandomPosition(8, 18, 3.5, -17, 0, 0)
         else return getRandomPosition(-3.5, 18, -8, -17, 0, 0)
      }
      else if (spawnAt === 'edge' && spawningMode === 'strips') {
         const topPart = Math.random() < 0.5
         if (topPart) return getRandomPosition(8, 18, 3.5, 17, 0, 0)
         else return getRandomPosition(-3.5, 18, -8, 17, 0, 0)
      }
      else throw new Error('unexpected spawnAt value')
   }
   const randomPosition = useRef(getFloatyPosition())

   // Rotation
   const rotationRef = useRef<[number, number, number]>([0, 0, Math.random() * Math.PI * 2])

   // Material
   const material = useMemo(() => {
      let materialsArray
      if (sizeRef.current === 'small') materialsArray = materials.small
      else if (sizeRef.current === 'medium') materialsArray = materials.medium
      else materialsArray = materials.big

      const materialIndex = Math.floor(Math.random() * materialsArray.length)
      const material = materialsArray[materialIndex].clone() // clone so we don’t recolor all floaties

      // Pick a random color
      const randomColor = new Color().set(floatiesColor);
      (material as any).color = randomColor

      return material
   }, [materials, sizeRef.current])

   // Scales
   const bodyScale = useMemo(() => {
      if (sizeRef.current === 'small') return 0.15;
      if (sizeRef.current === 'medium') return 0.25;
      if (sizeRef.current === 'big') return 0.4;
      throw new Error('unrecognized floaty size');
   }, [sizeRef.current]);

   // Force
   useEffect(() => {
      if (bodyRef.current == null) return
      bodyRef.current.addForce(new Vector3(-5, 0, 0), true)
   }, [])

   return (
      <RigidBody ref={bodyRef} canSleep={true} rotation={rotationRef.current} onCollisionEnter={onCollisionEnter} position={randomPosition.current} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}   >
         <BallCollider args={[bodyScale]} mass={0.5} />
         <mesh material={material} geometry={planeGeometry} />
      </RigidBody>
   )
}

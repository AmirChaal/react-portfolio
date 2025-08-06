import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Material, PlaneGeometry, Texture, Vector3 } from "three";
import { getRandomPosition } from "../../functions/3d";

const floatySizes = ['small', 'medium', 'big'] as const
type FloatySize = typeof floatySizes[number]

export default function WebGLFloaty({ uniqueKey, edgeBody, onRemove, spawnAt, materials, planeGeometry }: {
   readonly uniqueKey: number,
   readonly edgeBody: RapierRigidBody,
   readonly onRemove: (key: number) => void,
   readonly spawnAt: 'random' | 'edge'
   readonly materials: { small: Material[], medium: Material[], big: Material[] }
   readonly planeGeometry: PlaneGeometry
}) {
   const bodyRef = useRef(null) as RefObject<RapierRigidBody | null>
   const removeFloaty = () => { onRemove(uniqueKey) }

   // Size selection
   const sizeRef = useRef<FloatySize>('small')
   useEffect(() => {
      const random = Math.random();
      let size
      if (random < 0) size = 'small' as const
      else if (random < 0.5) size = 'medium' as const
      else size = 'big' as const
      sizeRef.current = size
   }, []);

   // Collision detection
   const onCollisionEnter = (collision: any) => {
      const otherBody = collision.other.rigidBody
      if (otherBody.handle !== edgeBody.handle) return
      removeFloaty()
   }

   // Position
   const getFloatyPosition = () => {
      if (spawnAt === 'random') return getRandomPosition(8, 16, -8, -16, 0, 0)
      else if (spawnAt === 'edge') return getRandomPosition(8, 16, -8, 16, 0, 0)
      else throw new Error('unexpected spawnAt value')
   }
   const randomPosition = useRef(getFloatyPosition())

   // Rotation
   const rotationRef = useRef([0, 0, 0] as [number, number, number])
   useEffect(() => {
      const z = Math.random() * (Math.PI * 2)
      rotationRef.current = [0, 0, z] as const
   }, [])

   // Material
   const selectedMaterialRef = useRef<Material | null>(null)
   useEffect(() => {
      let materialsArray
      if (sizeRef.current === 'small') materialsArray = materials.small
      else if (sizeRef.current === 'medium') materialsArray = materials.medium
      else if (sizeRef.current === 'big') materialsArray = materials.big
      else throw new Error('unexpected floaty size')
      const materialIndex = Math.floor(Math.random() * materialsArray.length)
      selectedMaterialRef.current = materialsArray[materialIndex]
   }, [materials, sizeRef.current])

   // Scales
   const bodyScaleRef = useRef(0.3)
   useEffect(() => {
      let bodyScale
      if (sizeRef.current === 'small') bodyScale = 0.15
      else if (sizeRef.current === 'medium') bodyScale = 0.25
      else if (sizeRef.current === 'big') bodyScale = 0.4
      else throw new Error('unrecognized floaty size')
      bodyScaleRef.current = bodyScale
   }, [sizeRef.current])

   // Force
   useEffect(() => {
      if (bodyRef.current == null) return
      bodyRef.current.addForce(new Vector3(-5, 0, 0), true)
   }, [])

   return (
      <RigidBody ref={bodyRef} rotation={rotationRef.current} onCollisionEnter={onCollisionEnter} position={randomPosition.current} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}   >
         <BallCollider args={[bodyScaleRef.current]} mass={0.5} />
         {(selectedMaterialRef.current) && <mesh material={selectedMaterialRef.current} geometry={planeGeometry} />}
      </RigidBody>
   )
}

import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Material, PlaneGeometry, Texture, Vector3 } from "three";
import { getRandomPosition } from "../../functions/3d";

export default function WebGLFloaty({ uniqueKey, bigFloatyMaterials, smallFloatyMaterials, edgeBody, onRemove, spawnAt, bigFloatyGeometryRef }: {
   readonly uniqueKey: number,
   readonly edgeBody: RapierRigidBody,
   readonly onRemove: (key: number) => void,
   readonly spawnAt: 'random' | 'edge'
   readonly bigFloatyMaterials: Material[]
   readonly smallFloatyMaterials: Material[]
   readonly bigFloatyGeometryRef: PlaneGeometry
}) {
   const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
   const bodyRef = useRef(null) as RefObject<RapierRigidBody | null>

   const removeFloaty = () => {
      onRemove(uniqueKey)
   }

   const onCollisionEnter = (collision: any) => {
      const otherBody = collision.other.rigidBody
      if (otherBody.handle !== edgeBody.handle) return
      removeFloaty()
   }

   const getFloatyPosition = () => {
      if (spawnAt === 'random') return getRandomPosition(7, 16, -7, -16, 0, 0)
      else if (spawnAt === 'edge') return getRandomPosition(7, 16, -7, 16, 0, 0)
      else throw new Error('unexpected spawnAt value')
   }
   const randomPosition = useRef(getFloatyPosition())

   useEffect(() => {
      const textureIndex = Math.floor(Math.random() * bigFloatyMaterials.length)
      setSelectedMaterial(bigFloatyMaterials[textureIndex])
   }, [bigFloatyMaterials])

   useEffect(() => {
      if (bodyRef.current == null) return
      bodyRef.current.addForce(new Vector3(-5, 0, 0), true)
   }, [])

   return (
      <RigidBody ref={bodyRef} onCollisionEnter={onCollisionEnter} position={randomPosition.current} scale={0.5} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}   >
         <BallCollider args={[1]} />
         {selectedMaterial && <mesh material={selectedMaterial} geometry={bigFloatyGeometryRef} />}
      </RigidBody>
   )
}

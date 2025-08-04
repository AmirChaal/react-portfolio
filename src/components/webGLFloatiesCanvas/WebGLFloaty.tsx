import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Texture, Vector3 } from "three";
import { getRandomPosition } from "../../functions/3d";

export default function WebGLFloaty({ textures, edgeBody, onRemove, spawnAt }: {
   readonly textures: Texture[],
   readonly edgeBody: RapierRigidBody
   readonly onRemove: () => void
   readonly spawnAt: 'random' | 'edge'
}) {
   const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null)
   const bodyRef = useRef(null) as RefObject<RapierRigidBody | null>
   const [active, setActive] = useState(true)

   // Remove floaty
   const removeFloaty = () => {
      setActive(false)
      onRemove()
   }

   // Collision
   const onCollisionEnter = (collision: any) => {
      const otherBody = collision.other.rigidBody
      if (otherBody.handle !== edgeBody.handle) return
      removeFloaty()
   }

   // Position
   const getFloatyPosition = () => {
      if (spawnAt === 'random') return getRandomPosition(7, 15.5, -7, -15.5, 0, 0)
      else if (spawnAt === 'edge') return getRandomPosition(7, 16.5, -7, 16.5, 0, 0)
      else throw new Error('unexpected spawnAt value')
   }
   const randomPosition = useRef(getFloatyPosition())

   // Texture
   useEffect(() => {
      const textureIndex = Math.floor(Math.random() * textures.length)
      setSelectedTexture(textures[textureIndex])
   }, [textures])

   // Force
   useEffect(() => {
      if (bodyRef.current == null) return
      bodyRef.current.addForce(new Vector3(-5, 0, 0), true)
   }, [])

   return (
      <>
         {active && <RigidBody ref={bodyRef} onCollisionEnter={(collision) => onCollisionEnter(collision)} position={randomPosition.current} scale={0.5} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]} >
            <BallCollider args={[1]} />
            <mesh>
               <planeGeometry args={[2, 2]} />
               {selectedTexture && <meshBasicMaterial map={selectedTexture} toneMapped={false} transparent={true} />}
            </mesh>
         </RigidBody>
         }
      </>
   )
}

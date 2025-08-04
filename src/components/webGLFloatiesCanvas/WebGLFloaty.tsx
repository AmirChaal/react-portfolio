import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Texture } from "three";

export default function WebGLFloaty({ textures, addFloaty, removeFloaty }: {
   readonly textures: Texture[],
   readonly addFloaty: (rigidBody: RapierRigidBody) => void,
   readonly removeFloaty: (rigidBody: RapierRigidBody) => void
}) {
   const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null)
   const floatyRef = useRef(null) as RefObject<RapierRigidBody | null>

   useEffect(() => {
      const textureIndex = Math.floor(Math.random() * textures.length)
      setSelectedTexture(textures[textureIndex])
   }, [textures])

   useEffect(() => {
      const floaty = floatyRef.current
      if (floaty == null) return
      addFloaty(floaty)

      return () => {
         if (floaty == null) return
         removeFloaty(floaty)
      }
   }, [selectedTexture])

   return (
      <RigidBody ref={floatyRef} scale={0.5} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} position={[3, 3, 0]} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
         <BallCollider args={[1]} />
         <mesh>
            <planeGeometry args={[2, 2]} />
            {selectedTexture && <meshBasicMaterial map={selectedTexture} toneMapped={false} transparent={true} />}
         </mesh>
      </RigidBody>
   )
}

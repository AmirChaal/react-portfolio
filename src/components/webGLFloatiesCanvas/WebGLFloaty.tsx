import { BallCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { SphereGeometry, Texture, Vector3, type Material } from "three";

export default function WebGLFloaty({ textures, material, geometry, addFloaty }: { textures: Texture[], material: Material, geometry: SphereGeometry, addFloaty: any }) {
   const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null)
   const floatyRef = useRef(null)

   useEffect(() => {
      const textureIndex = Math.floor(Math.random() * textures.length)
      setSelectedTexture(textures[textureIndex])
   }, [textures])

   useEffect(() => {
      if (selectedTexture && floatyRef.current) {
         addFloaty(floatyRef.current)
      }
   }, [selectedTexture])

   if (!selectedTexture) return null

   return (
      <RigidBody ref={floatyRef} scale={0.5} restitution={1} colliders={false} linearDamping={8} angularDamping={8} type="dynamic" gravityScale={0} position={[3, 3, 0]} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
         <BallCollider args={[1]} />
         <mesh>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={selectedTexture} toneMapped={false} transparent={true} />
            {/* <meshBasicMaterial color={'red'} /> */}
         </mesh>
      </RigidBody>
   )
}

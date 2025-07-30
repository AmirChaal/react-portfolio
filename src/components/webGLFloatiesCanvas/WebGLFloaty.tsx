import { BallCollider, RigidBody } from "@react-three/rapier";
import { SphereGeometry, TextureLoader, type Material } from "three";

export default function WebGLFloaty({ material, geometry }: { material: Material, geometry: SphereGeometry}) {
   const textureLoader = new TextureLoader()
   textureLoader.load()
   
   return (
      <RigidBody scale={0.5} restitution={1} colliders={false} linearDamping={8} type="dynamic" gravityScale={0} position={[3, 3, 0]} enabledTranslations={[true, true, false]} enabledRotations={[false, false, true]}>
         <BallCollider args={[1]} />
         <mesh geometry={geometry} material={material} />
      </RigidBody>
   )
}
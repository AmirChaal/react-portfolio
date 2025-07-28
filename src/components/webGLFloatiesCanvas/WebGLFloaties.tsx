import { useFrame, useThree } from "@react-three/fiber";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import { useRef, type RefObject } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2, Vector3 } from "three";
import { useGlobal } from "../../stores/global";

export default function WebGLFloaties() {
   // Debug

   const boxGeometryRef = useRef(new BoxGeometry())
   const invisibleMaterialRef = useRef(new MeshBasicMaterial({ transparent: true, opacity: 0 }))
   const sphereGeometryRef = useRef(new SphereGeometry(1, 8, 6))
   const particleMaterialRef = useRef(new MeshBasicMaterial({ color: '#f2f2f2', toneMapped: false }))
   const stirrerRef = useRef({}) as any
   const { getNDC } = useGlobal()

   const { camera } = useThree()

   // Raycaster
   const receiverPlaneRef = useRef({}) as RefObject<Mesh>
   const pointerIndicatorRef = useRef({}) as RefObject<Mesh>
   useFrame((state, delta) => {
      const ndc = getNDC()

      // Get intersection of camera ray with receiver plane
      const raycaster = new Raycaster()
      raycaster.setFromCamera(ndc, camera)
      const intersects = raycaster.intersectObject(receiverPlaneRef.current, true);
      const cursorPosition = intersects[0].point

      // Cursor indicator
      pointerIndicatorRef.current.position.copy(new Vector3(cursorPosition.x, cursorPosition.y, 3))


      if (intersects.length > 0 && stirrerRef.current?.translation != null) {
         console.log(stirrerRef.current.translation())
         const stirrerPosition = stirrerRef.current.translation()
         const toCursorVector = new Vector3().subVectors(cursorPosition, stirrerPosition)
         const toCursorForce = toCursorVector.multiplyScalar(700 * delta)
         toCursorForce.clampLength(0, 30)
         stirrerRef.current.setLinvel(toCursorForce)
      }
   });

   return (
      <Physics>
         <RigidBody type="fixed" restitution={1} >
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, -8.5, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[35, 3, 3]} position={[0, 8.5, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[-16.5, 0, 0]} />
            <mesh geometry={boxGeometryRef.current} material={invisibleMaterialRef.current} scale={[3, 18, 3]} position={[16.5, 0, 0]} />
         </RigidBody>

         <RigidBody ref={stirrerRef} gravityScale={0} type="dynamic" enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={50} restitution={0} />
            <mesh material={new MeshBasicMaterial({ color: '#00b3ff' })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>

         {[...Array(10)].map((_, i) => {
            return <RigidBody key={i} restitution={1} linearDamping={8} type="dynamic" colliders="ball" gravityScale={0} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
               <mesh key={i} geometry={sphereGeometryRef.current} material={particleMaterialRef.current} position={[0, 0, 0]} scale={0.5} />
            </RigidBody>
         })}

         <mesh ref={receiverPlaneRef} position={[0, 0, 0]} material={invisibleMaterialRef.current}>
            <planeGeometry args={[150, 75]} />
            {/* <meshBasicMaterial color="blue" /> */}
         </mesh>

         <mesh ref={pointerIndicatorRef} scale={0.15} >
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="black" />
         </mesh>
      </Physics>
   )
}
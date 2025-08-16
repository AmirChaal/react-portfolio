import { useEffect, useRef, useState } from "react"
import { useGlobal } from "../../stores/global"
import { BallCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier"
import { MeshBasicMaterial, type Mesh, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"

export default function WebGLFloatiesStirrer({ visible, cursor3DPosition }: { visible: boolean, cursor3DPosition: Vector3 | null }) {
   const animationDuration = 1 // Seconds

   const { stirrerColor } = useGlobal()
   const stirrerRef = useRef(null as RapierRigidBody | null)
   const stirrerMeshRef = useRef(null as null | Mesh)
   const [stirrerRadius, setStirrerRadius] = useState(visible ? 1 : 0)
   const [stirrerFollowVectorMultiplier, setStirrerFollowVectorMultiplier] = useState(visible ? 1 : 0)

   // Activate and deactivate rigidbody
   useEffect(() => {
      let timeoutId: null | number = null

      if (stirrerRef.current == null) return
      if (!visible) {
         timeoutId = setTimeout(() => {
            if (stirrerRef.current == null) return
            stirrerRef.current.setEnabled(false)
         }, animationDuration * 1000)
      }
      else {
         stirrerRef.current.setEnabled(true)
      }

      return () => {
         if (timeoutId != null) clearTimeout(timeoutId)
      }
   }, [visible])

   useEffect(() => {
      gsap.to({ value: stirrerRadius }, {
         value: visible ? 1 : 0,
         duration: animationDuration,
         ease: visible ? "elastic.out(1,0.4)" : "power2.out",
         onUpdate: function () { setStirrerRadius(this.targets()[0].value) }
      })

      if (visible === true) setStirrerFollowVectorMultiplier(0)
      gsap.to({ value: stirrerFollowVectorMultiplier }, {
         value: visible ? 1 : 0,
         duration: animationDuration,
         ease: "power2.in",
         onUpdate: function () { setStirrerFollowVectorMultiplier(this.targets()[0].value) }
      })
   }, [visible])

   /**
    * useFrame
    */
   const elapsedTimeRef = useRef(0)
   useFrame((state, delta) => {
      elapsedTimeRef.current += delta

      // Stirrer radius
      if (stirrerRef.current != null && stirrerMeshRef.current != null) {
         stirrerMeshRef.current.scale.x = stirrerRadius
         stirrerMeshRef.current.scale.z = stirrerRadius
      }

      // Stirrer follow
      if (stirrerRef.current?.translation != null && cursor3DPosition != null) {
         const stirrerPosition = stirrerRef.current.translation()
         const toCursorVector = new Vector3().subVectors(cursor3DPosition, stirrerPosition)
         const cappedDelta = Math.min(1 / 30, delta)
         const toCursorForce = toCursorVector.multiplyScalar(cappedDelta * 1000)
         toCursorForce.clampLength(0, 30 * stirrerFollowVectorMultiplier)
         stirrerRef.current.setLinvel(toCursorForce, false)
      }
   });

   return (
      <>
         {<RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[0.75]} mass={0} restitution={0} />
            <mesh ref={stirrerMeshRef} material={new MeshBasicMaterial({ color: stirrerColor, toneMapped: false })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 25]} />
            </mesh>
         </RigidBody>}
      </>
   )
}

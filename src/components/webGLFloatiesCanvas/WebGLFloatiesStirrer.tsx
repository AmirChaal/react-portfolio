import { useEffect, useRef, useState } from "react"
import { useGlobal } from "../../stores/global"
import { BallCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier"
import { MeshBasicMaterial, type Mesh, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import gsap from "gsap"

export default function WebGLFloatiesStirrer({ visible, cursor3DPosition }: { visible: boolean, cursor3DPosition: Vector3 | null }) {
   const animationDuration = 1 // Seconds
   const stirrerMaxRadius = 1.75

   const { stirrerColor, update } = useGlobal()
   const stirrerRef = useRef(null as RapierRigidBody | null)
   const stirrerMeshRef = useRef(null as null | Mesh)
   const [stirrerRadius, setStirrerRadius] = useState(visible ? stirrerMaxRadius : 0)
   const [stirrerFollowVectorMultiplier, setStirrerFollowVectorMultiplier] = useState(visible ? 1 : 0)

   // Provide stirrerRef
   useEffect(() => {
      if (stirrerRef.current != null) update({ globalStirrerBody: stirrerRef.current })
   }, [stirrerRef.current])

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
         value: visible ? stirrerMaxRadius : 0,
         duration: animationDuration,
         ease: visible ? "elastic.out(1,0.4)" : "power2.out",
         onUpdate: function () { setStirrerRadius(this.targets()[0].value) }
      })

      if (visible === true) setStirrerFollowVectorMultiplier(0)
      gsap.to({ value: stirrerFollowVectorMultiplier }, {
         value: visible ? stirrerMaxRadius : 0,
         duration: animationDuration,
         ease: "power2.in",
         onUpdate: function () { setStirrerFollowVectorMultiplier(this.targets()[0].value) }
      })
   }, [visible])

   /**
    * useFrame
    */
   const elapsedTimeRef = useRef(0)
   const tempVector = new Vector3()
   useFrame((state, delta) => {
      // Stirrer radius
      if (stirrerRef.current != null && stirrerMeshRef.current != null) {
         stirrerMeshRef.current.scale.x = stirrerRadius
         stirrerMeshRef.current.scale.z = stirrerRadius
      }

      // Stirrer follow
      if (stirrerRef.current?.translation != null && cursor3DPosition != null) {
         const stirrerPosition = stirrerRef.current.translation()
         tempVector.subVectors(cursor3DPosition, stirrerPosition)

         // Reduce damping for snappier response
         const damping = 0.05
         const currentVel = stirrerRef.current.linvel()
         tempVector.lerp(currentVel, damping)
         tempVector.multiplyScalar(5)

         // Increase max speed for faster response
         const maxSpeed = 30 * stirrerFollowVectorMultiplier
         tempVector.clampLength(0, maxSpeed)

         stirrerRef.current.setLinvel(tempVector, false)
      }
   })

   return (
      <>
         {<RigidBody ref={stirrerRef} canSleep={false} gravityScale={0} type="dynamic" colliders={false} enabledTranslations={[true, true, false]} enabledRotations={[false, false, false]}>
            <BallCollider args={[stirrerMaxRadius * 0.75]} mass={0} restitution={0} />
            <mesh ref={stirrerMeshRef} material={new MeshBasicMaterial({ color: stirrerColor, toneMapped: false })} rotation={[Math.PI / 2, 0, 0]} >
               <cylinderGeometry args={[0.75, 0.5, 0.1, 30]} />
            </mesh>
         </RigidBody>}
      </>
   )
}

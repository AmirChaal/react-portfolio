import { Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { useGlobal } from "../../stores/global"
import { div } from "three/tsl"

export default function AvyHead() {
   const meshRef = useRef(null)

   const { count, inc } = useGlobal()


   useEffect(() => {
      inc()
   }, [])
   
   useEffect(() => {
      console.log(count)
   }, [count])


   useFrame((state, delta) => {

   })

   return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2} floatingRange={[-0.1, 0.1]} >
         <mesh ref={meshRef} position={[0, 0, 2]}>
            <boxGeometry />
            <meshStandardMaterial />
         </mesh>
      </Float>
   )

}
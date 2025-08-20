import { useRef, useState, type ComponentPropsWithoutRef } from "react"
import { useGlobal } from "../../stores/global"
import { NearestFilter } from "three"

export default function AvyHeadFace({ ...wrapperProps }: ComponentPropsWithoutRef<"mesh">) {
   const { textures, textColor } = useGlobal()

   const [mode, setMode] = useState<'awake' | 'closed'>('awake')

   const openEyeTextureRef = useRef(textures.avyCuteOpenEye)
   openEyeTextureRef.current.minFilter = NearestFilter
   openEyeTextureRef.current.magFilter = NearestFilter

   const openMouthTextureRef = useRef(textures.avyCuteOpenMouth)
   openMouthTextureRef.current.minFilter = NearestFilter
   openMouthTextureRef.current.magFilter = NearestFilter

   return (
      <>
         <group position={[0, 0, 0.7]}>
            <mesh position={[-0.2, 0, 0]} >
               <planeGeometry />
               <meshStandardMaterial map={openEyeTextureRef.current} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={0} polygonOffsetUnits={-1} />
            </mesh>

            <mesh position={[0.2, 0, 0]}>
               <planeGeometry />
               <meshStandardMaterial map={openEyeTextureRef.current} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
            </mesh>

            <mesh position={[0, -0.25, 0]}>
               <planeGeometry />
               <meshStandardMaterial map={openMouthTextureRef.current} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={-2} polygonOffsetUnits={-1} />
            </mesh>
         </group>
      </>
   )
}
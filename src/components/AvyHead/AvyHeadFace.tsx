import { useRef, useState, type ComponentPropsWithoutRef } from "react"
import { useGlobal } from "../../stores/global"
import { Group, Mesh, NearestFilter, Raycaster, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { getCursor3DPosition, getCursorAngle, getWorldPosition } from "../../functions/3d"

export default function AvyHeadFace({ cursor3DPosition, ...wrapperProps }: { cursor3DPosition: Vector3 | null } & ComponentPropsWithoutRef<"mesh">) {
   const { textures, textColor, getNDC } = useGlobal()
   const { camera } = useThree()
   const [mode, setMode] = useState<'awake' | 'closed'>('awake')
   const leftEyeRef = useRef<Mesh>(null)
   const rightEyeRef = useRef<Mesh>(null)
   const indicatorRef = useRef<Mesh>(null)
   const faceGroupRef = useRef<Group>(null)
   const receiverPlaneRef = useRef<Mesh>(null)

   // ==== Materials ====
   const openEyeTextureRef = useRef(textures.avyCuteOpenEye)
   openEyeTextureRef.current.minFilter = NearestFilter
   openEyeTextureRef.current.magFilter = NearestFilter

   const openMouthTextureRef = useRef(textures.avyCuteOpenMouth)
   openMouthTextureRef.current.minFilter = NearestFilter
   openMouthTextureRef.current.magFilter = NearestFilter

   //  ==== UseFrame ====
   const raycasterRef = useRef(new Raycaster())
   useFrame(() => {
      let cursor3D
      if (receiverPlaneRef.current) cursor3D = getCursor3DPosition(getNDC, receiverPlaneRef.current, raycasterRef.current, camera)

      let Cursor3DAngle
      if (cursor3D && receiverPlaneRef.current) Cursor3DAngle = getCursorAngle(cursor3D, receiverPlaneRef.current)
      console.log(Cursor3DAngle)

      if (leftEyeRef.current && rightEyeRef.current && faceGroupRef.current && cursor3DPosition) {

         // Get middle of eyes position
         const leftEyePosition = getWorldPosition(leftEyeRef.current)
         const rightEyePosition = getWorldPosition(rightEyeRef.current)
         const middleOfEyes = new Vector3().addVectors(leftEyePosition, rightEyePosition).multiplyScalar(0.5)

         const flattenedCursor3D = new Vector3(cursor3DPosition.x, cursor3DPosition.y, 0)
         const flattenedMiddleOfEyes = new Vector3(middleOfEyes.x, middleOfEyes.y, 0)
         const eyesToCursor = new Vector3().subVectors(flattenedCursor3D, flattenedMiddleOfEyes)
         const cursorAngle = Math.atan2(eyesToCursor.y, eyesToCursor.x)
         indicatorRef.current?.position.copy(eyesToCursor)
      }
   })

   return (
      <>
         <mesh ref={indicatorRef} scale={0.1}>
            <sphereGeometry />
            <meshBasicMaterial color="blue" />
         </mesh>

         <group ref={faceGroupRef} position={[0, 0, 0.7]}>
            <mesh ref={receiverPlaneRef}>
               <planeGeometry args={[1, 1]} />
               <meshBasicMaterial color="blue" />
            </mesh>

            <mesh ref={leftEyeRef} position={[-0.2, 0, 0]} >
               <planeGeometry />
               <meshStandardMaterial map={openEyeTextureRef.current} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={0} polygonOffsetUnits={-1} />
            </mesh>

            <mesh ref={rightEyeRef} position={[0.2, 0, 0]}>
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
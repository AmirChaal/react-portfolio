import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react"
import { useGlobal } from "../../stores/global"
import { Group, Mesh, NearestFilter, Plane, Raycaster, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { getCursor3DPosition, getCursor3DPositionOnPlane, getCursorAngle, getWorldPosition } from "../../functions/3d"

function getEyeRotation(x: number, active: boolean) {
   if (active) return (Math.PI / 10) * Math.sin(4 * Math.PI * x);
   else return 0
}

export default function AvyHeadFace({ avyHeadGroup, visible, ...wrapperProps }: { avyHeadGroup: Group | null, visible: boolean } & ComponentPropsWithoutRef<"group">) {
   const { textures, textColor, getNDC } = useGlobal()
   const { camera } = useThree()
   const [eyesOpen, setEyesOpen] = useState<boolean>(true)
   const leftEyeRef = useRef<Mesh>(null)
   const rightEyeRef = useRef<Mesh>(null)
   const indicatorRef = useRef<Mesh>(null)
   const faceGroupRef = useRef<Group>(null)
   const receiverPlaneRef = useRef<Mesh>(null)

   // ==== Materials ====
   const openEyeTextureRef = useRef(textures.avyCuteOpenEye)
   openEyeTextureRef.current.minFilter = NearestFilter
   openEyeTextureRef.current.magFilter = NearestFilter

   const closedRightEyeTextureRef = useRef(textures.avyCuteClosedRightEye)
   closedRightEyeTextureRef.current.minFilter = NearestFilter
   closedRightEyeTextureRef.current.magFilter = NearestFilter

   const closedLeftEyeTextureRef = useRef(textures.avyCuteClosedLeftEye)
   closedLeftEyeTextureRef.current.minFilter = NearestFilter
   closedLeftEyeTextureRef.current.magFilter = NearestFilter

   const openMouthTextureRef = useRef(textures.avyCuteOpenMouth)
   openMouthTextureRef.current.minFilter = NearestFilter
   openMouthTextureRef.current.magFilter = NearestFilter

   useEffect(() => {
      setInterval(() => {
         if (Math.random() < 0.5) {
            setEyesOpen(false)
            setTimeout(() => setEyesOpen(true), 200)
         }
      }, 2500)
   }, [])

   const [leftEyeTexture, setLeftEyeTexture] = useState(openEyeTextureRef.current)
   const [rightEyeTexture, setRightEyeTexture] = useState(openEyeTextureRef.current)
   useEffect(() => {
      if (eyesOpen) {
         setLeftEyeTexture(openEyeTextureRef.current)
         setRightEyeTexture(openEyeTextureRef.current)
      }
      else {
         setLeftEyeTexture(closedLeftEyeTextureRef.current)
         setRightEyeTexture(closedRightEyeTextureRef.current)
      }
   }, [eyesOpen])

   //  ==== UseFrame ====
   const raycasterRef = useRef(new Raycaster())
   useFrame((state, delta) => {
      let cursor3D
      if (receiverPlaneRef.current) cursor3D = getCursor3DPosition(getNDC, receiverPlaneRef.current, raycasterRef.current, camera)

      let Cursor3DAngle
      if (cursor3D && receiverPlaneRef.current) Cursor3DAngle = getCursorAngle(cursor3D, receiverPlaneRef.current)

      if (leftEyeRef.current && rightEyeRef.current && faceGroupRef.current && faceGroupRef.current.parent) {
         // Get middle of eyes position
         const leftEyePosition = getWorldPosition(leftEyeRef.current)
         const rightEyePosition = getWorldPosition(rightEyeRef.current)
         const middleOfEyes = new Vector3().addVectors(leftEyePosition, rightEyePosition).multiplyScalar(0.5)

         // Get middle of eyes direction
         const middleOfEyesDirection = new Vector3()
         faceGroupRef.current.getWorldDirection(middleOfEyesDirection)

         // Get cursor 3D position on face plane
         const receiverPlane = new Plane()
         receiverPlane.setFromNormalAndCoplanarPoint(middleOfEyesDirection, middleOfEyes)
         const cursor3D = getCursor3DPositionOnPlane(getNDC, receiverPlane, raycasterRef.current, camera)
         const cursor3DLocalPosition = faceGroupRef.current.parent.worldToLocal(cursor3D.clone())
         const middleOfEyesLocalPosition = faceGroupRef.current.parent.worldToLocal(middleOfEyes.clone())

         // Get atan2 of cursor3D around middle of eyes
         const middleOfEyesToCursor3D = new Vector3().subVectors(cursor3DLocalPosition, middleOfEyesLocalPosition)
         const atan = Math.atan2(middleOfEyesToCursor3D.y, middleOfEyesToCursor3D.x)
         const functionProgress = (atan + Math.PI) / (Math.PI * 2)

         // Get inactive threshhold
         const followingEnabled = middleOfEyesToCursor3D.length() > 0.5

         // Get eye rotation
         const eyeRotation = getEyeRotation(functionProgress, followingEnabled)
         const smoothing = 0.1; // smaller = smoother/slower
         if (eyesOpen) {
            leftEyeRef.current.rotation.z += (eyeRotation - leftEyeRef.current.rotation.z) * smoothing * delta * 25;
            rightEyeRef.current.rotation.z += (eyeRotation - rightEyeRef.current.rotation.z) * smoothing * delta * 25;
         } else {
            leftEyeRef.current.rotation.z = 0
            rightEyeRef.current.rotation.z = 0
         }
      }
   })

   return (
      <>
         {/* <mesh ref={indicatorRef} scale={0.1}>
            <sphereGeometry />
            <meshBasicMaterial color="blue" />
         </mesh> */}

         {visible && <group ref={faceGroupRef} position={[0, 0, 0.7]} {...wrapperProps}>
            <mesh ref={leftEyeRef} position={[-0.2, 0, 0]} >
               <planeGeometry />
               <meshStandardMaterial map={leftEyeTexture} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={0} polygonOffsetUnits={-1} />
            </mesh>

            <mesh ref={rightEyeRef} position={[0.2, 0, 0]}>
               <planeGeometry />
               <meshStandardMaterial map={rightEyeTexture} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
            </mesh>

            <mesh position={[0, -0.25, 0]}>
               <planeGeometry />
               <meshStandardMaterial map={openMouthTextureRef.current} color={textColor} transparent={true} depthWrite={false} polygonOffset={true} polygonOffsetFactor={-2} polygonOffsetUnits={-1} />
            </mesh>
         </group>}
      </>
   )
}
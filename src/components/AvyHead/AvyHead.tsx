import { Float } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useImperativeHandle, useState, useMemo } from "react";
import { useGlobal } from "../../stores/global";
import { Group, MeshBasicMaterial, MeshStandardMaterial, Texture, type Mesh } from "three";
import AvyHeadModel from "./AvyHeadModel";
import AvyHeadFace from "./AvyHeadFace";
import { usePersistentGlobal } from "../../stores/persistentGlobal";
import { useAvyNoise, useRobavyActiveStateHandler, useRobavyCursorFollowing } from "../../functions/robavyHead";
import { PlaneGeometry } from "three";

export default forwardRef(function AvyHead({ visible }: { visible: boolean }, ref) {
   const { getNDC, update, textures, textColor } = useGlobal();
   const { playSoundEffects } = usePersistentGlobal()

   // Ref of the group containing the robavy model, the face component and the plane displaying the work image.
   // Internal to the component, exposed so that the parent can retrieve it through the "ref" attribute
   const internalHeadRef = useRef<Group>(null);
   useImperativeHandle(ref, () => internalHeadRef.current, []);

   // Expose screen control functions through the global store
   const [avyScreenWorkTexture, setAvyScreenWorkTexture] = useState<Texture | null>(null)
   useEffect(() => update({ changeAvyScreenWorkTexture: setAvyScreenWorkTexture }), [])

   // Robavy screen material
   const avyScreenMaterialRef = useRef(
      new MeshStandardMaterial({
         map: textures.avyScreenEmpty,
         transparent: true,
         color: textColor
      })
   );

   // Robavy screen + noise sound logic
   const { faceVisible } = useAvyNoise({
      avyScreenNoiseTexture: textures.avyScreenNoise,
      avyScreenEmptyTexture: textures.avyScreenEmpty,
      screenMaterialRef: avyScreenMaterialRef,
      workTexture: avyScreenWorkTexture,
      playSoundEffects
   })

   // Robavy rotation to follow cursor logic
   const cursorFollowerRef = useRef<Mesh>(null);
   const receiverPlaneRef = useRef<Mesh>(null);
   useRobavyCursorFollowing({
      getNDC,
      receiverPlaneRef,
      cursorFollowerRef,
      internalHeadRef
   })

   // Robavy position logic
   useRobavyActiveStateHandler({
      visible,
      internalHeadRef
   })


   // On Firefox, a race condition between the disposal of the geometry accross mounts/unmounts and the firefox rendering engine makes the receiverPlane
   // invisible and prevents it from receiving raycasts. So we create and memoize the plane geometries and materiall so it is not re-created/disposed across mounts
   const receiverGeometry = useMemo(() => new PlaneGeometry(10, 12), []);
   const receiverMaterial = useMemo(() => new MeshBasicMaterial({ color: "blue", transparent: true, opacity: 0 }), []);
   const robavyScreenPlaneGeometry = useMemo(() => new PlaneGeometry(1.4, 1.3), [])

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollowerRef} position={[0, 0, 4.8]} castShadow receiveShadow>
            {/* Debug geometry if needed */}
         </mesh>

         <mesh ref={receiverPlaneRef} position={[0, 0, -3.5]} >
            <primitive object={receiverGeometry} attach="geometry" />
            <primitive object={receiverMaterial} attach="material" />
         </mesh>

         {/* Avy head with screen */}
         <Float speed={5} rotationIntensity={0.1} floatingRange={[-0.1, 0.1]}>
            <group ref={internalHeadRef} position={[-2.5, 0, -7.5]} scale={1.6}>
               <AvyHeadModel />

               <mesh position={[0, -0.085, 0.64]}  receiveShadow >
                  <primitive object={robavyScreenPlaneGeometry} attach="geometry" />
                  <primitive object={avyScreenMaterialRef.current} attach="material" />
               </mesh>

               <AvyHeadFace avyHeadGroup={internalHeadRef.current} visible={faceVisible} />
            </group>
         </Float>
      </>
   );
});

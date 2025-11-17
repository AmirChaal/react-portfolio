import { Float } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from "react";
import { useGlobal } from "../../stores/global";
import { Group, MeshStandardMaterial, Texture, type Mesh } from "three";
import AvyHeadModel from "./AvyHeadModel";
import AvyHeadFace from "./AvyHeadFace";
import { usePersistentGlobal } from "../../stores/persistentGlobal";
import { useAvyNoise, useRobavyActiveStateHandler, useRobavyCursorFollowing } from "../../functions/robavyHead";

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

   // Robavy cursor following logic
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

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollowerRef} position={[0, 0, 4.8]} castShadow receiveShadow>
            {/* Debug geometry if needed */}
         </mesh>

         <mesh
            ref={receiverPlaneRef}
            position={[0, 0, -1]}
            frustumCulled={false}
            onUpdate={(self) => {
               // ensures bounding data exists for raycasting
               self.updateMatrixWorld(true);
            }}
         >
            <planeGeometry args={[10, 10]} />
            <meshBasicMaterial
               color="white" // needs a color to guarantee initialization
               transparent
               opacity={0}   // fully invisible
            />
         </mesh>

         {/* Avy head with screen */}
         <Float speed={5} rotationIntensity={0.1} floatingRange={[-0.1, 0.1]}>
            <group ref={internalHeadRef} position={[-2.5, 0, -7.5]} scale={1.6}>
               <AvyHeadModel />

               <mesh position={[0, -0.085, 0.64]} material={avyScreenMaterialRef.current} receiveShadow>
                  <planeGeometry args={[1.4, 1.3]} />
               </mesh>
               <AvyHeadFace avyHeadGroup={internalHeadRef.current} visible={faceVisible} />
            </group>
         </Float>
      </>
   );
});

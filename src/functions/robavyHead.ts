import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { RepeatWrapping, Texture, MeshStandardMaterial, Vector2, Group } from "three";
import { createAutoplayAudio } from "./audio";
import { Raycaster, Vector3, Mesh } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { getCursor3DPosition } from "./3d";

// Custom hook that manages Robavy's screen material, and noise audio
export function useAvyNoise(params: {
   // Used when a noise phase is active
   avyScreenNoiseTexture: Texture;
   // Used when there's no current noise phase and no work texture
   avyScreenEmptyTexture: Texture;
   // Material of robavy screen. Updated to show either a work texture, a noise texture or an empty texture
   screenMaterialRef: React.MutableRefObject<MeshStandardMaterial>;
   // Can be changed by any component of the app. 
   workTexture: Texture | null;
   // Decides if noise sound effect should play
   playSoundEffects: boolean;
}) {
   const {
      avyScreenNoiseTexture,
      avyScreenEmptyTexture,
      screenMaterialRef,
      workTexture,
      playSoundEffects
   } = params;

   // Stores the id of the repeating function call that repeatedly screambles the noise texture. Used to stop the scrambling when disableNoise is called
   const noiseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
   // Enable noise: static audio + noise texture that randomny offsets every few milliseconds
   const enableNoise = () => {
      // If a noise phase is already ongoing, don't initiate another one
      if (noiseIntervalRef.current) return;

      // If user didn't mute sound effects, start playing the noise sound
      if (playSoundEffects) gsap.to(staticAudioRef.current, { volume: 0.2, duration: 0.05 });

      // Make Robavy's screen material a repeating noise pattern
      screenMaterialRef.current.map = avyScreenNoiseTexture;
      screenMaterialRef.current.map.wrapS = RepeatWrapping;
      screenMaterialRef.current.map.wrapT = RepeatWrapping;
      screenMaterialRef.current.needsUpdate = true;

      // Offset the repeating noise texture by a random value every few milliseconds 
      noiseIntervalRef.current = setInterval(() => {
         if (!screenMaterialRef.current.map) return;
         screenMaterialRef.current.map.offset.set(Math.random() * 2 - 1, Math.random() * 2 - 1);
         screenMaterialRef.current.needsUpdate = true;
      }, 25);
   };

   // Disable noise
   const disableNoise = () => {
      // If there's no ongoing noise phase, do nothing
      if (!noiseIntervalRef.current) return;

      // mute noise audio
      gsap.to(staticAudioRef.current, { volume: 0, duration: 0.05 });

      // stop the repeating function call to scramble the noise texture and empty the interval id storage
      clearInterval(noiseIntervalRef.current);
      noiseIntervalRef.current = null;
   };

   // 1. Create audio & silently autoplay it
   const staticAudioRef = useRef<HTMLAudioElement | null>(null);
   useEffect(() => {
      staticAudioRef.current = createAutoplayAudio("/audio/tv_static.mp3", { startingVolume: 0 }).audio;
   }, [])

   // 2. Respond to changes in workTexture : enable noise → then swap textures → then disable noise
   // Stores the timeout ID for the call that changes the screen material to the new work texture and disables noise
   const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
   useEffect(() => {
      // Clear pending timeouts first
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current = [];

      // Start noise
      enableNoise();

      // Swap material after a delay
      timeoutsRef.current.push(
         setTimeout(() => {
            screenMaterialRef.current.map = workTexture ?? avyScreenEmptyTexture;
            screenMaterialRef.current.needsUpdate = true;

            disableNoise();
         }, 200)
      );

      return () => {
         timeoutsRef.current.forEach(t => clearTimeout(t));
      };
   }, [workTexture]);

   // 3. Face visibility logic, if there is no noise phase currently active and if there's no work texture inputed make fase visible
   const [faceVisible, setFaceVisible] = useState(false);
   useEffect(() => {
      const currentScreenTextureIsEmpty = screenMaterialRef.current.map?.uuid === avyScreenEmptyTexture.uuid
      const thereIsNoWorkTexture = workTexture == null
      if (currentScreenTextureIsEmpty && thereIsNoWorkTexture) {
         setFaceVisible(true);
      } else {
         setFaceVisible(false);
      }
   }, [workTexture, screenMaterialRef.current.map]);

   return { faceVisible };
}

export function useRobavyCursorFollowing(params: {
   // Function that returns the NDC
   getNDC: () => Vector2,
   // Mesh that receives the camera-to-cursor raycast to determine the position of the "3D cursor"
   receiverPlaneRef: RefObject<Mesh | null>,
   // mesh with no geometry nor material. The head follows it. It follows the cursor with a lerp delay
   cursorFollowerRef: RefObject<Mesh | null>,
   // Asked to look at the cursor follower
   internalHeadRef: RefObject<Group | null>
}) {
   const { getNDC, receiverPlaneRef, cursorFollowerRef, internalHeadRef } = params

   const { camera } = useThree();
   const raycasterRef = useRef(new Raycaster());
   const [cursor3DPosition, setCursor3DPosition] = useState<Vector3 | null>(null);

   useFrame((_, delta) => {
      const safeDelta = Math.min(delta, 0.05);

      if (receiverPlaneRef.current) {
         const positionOf3DCursor = getCursor3DPosition(getNDC, receiverPlaneRef.current, raycasterRef.current, camera);
         setCursor3DPosition(positionOf3DCursor);
      }

      if (cursor3DPosition && cursorFollowerRef.current && internalHeadRef.current) {
         const effectiveFollowerPosition = cursorFollowerRef.current!.position.lerp(cursor3DPosition, safeDelta * 6);
         cursorFollowerRef.current.position.copy(effectiveFollowerPosition);
         internalHeadRef.current.lookAt(cursorFollowerRef.current!.position);
      }
   });
}

export function useRobavyActiveStateHandler(params: {
   visible: boolean,
   internalHeadRef: RefObject<Group | null>
}) {
   const { visible, internalHeadRef } = params

   const positionRef = useRef(new Vector3(-2.5, visible ? 0 : 6, -7.5))
   useEffect(() => {
      if (!internalHeadRef.current) return;

      const toUp = gsap.to(positionRef.current, { y: 6, duration: 0.5, paused: true, ease: "power2.in", });
      const toMiddle = gsap.to(positionRef.current, { y: 0, duration: 1, paused: true, ease: "power2.out", });

      if (!visible) toUp.play();
      else toMiddle.play();

      return () => {
         toUp.kill();
         toMiddle.kill();
      };
   }, [visible]);

   useFrame((_, delta) => {
      if (internalHeadRef.current != null) {
         internalHeadRef.current.position.copy(positionRef.current)
      }
   });
}
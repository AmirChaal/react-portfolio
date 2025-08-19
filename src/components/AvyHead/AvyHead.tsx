import { Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from "react";
import { useGlobal } from "../../stores/global";
import { Material, MeshBasicMaterial, MeshStandardMaterial, Raycaster, RepeatWrapping, Texture, Vector2, Vector3, type Mesh } from "three";
import AvyHeadModel from "./AvyHeadModel";
import gsap from "gsap";
import { color } from "three/tsl";

export default forwardRef(function AvyHead({ visible }: { visible: boolean }, ref) {
   const { getNDC, update, textures } = useGlobal();
   const internalHeadRef = useRef<Mesh>(null);
   const cursorFollower = useRef<Mesh>(null);
   const receiverPlaneRef = useRef<Mesh>(null);
   const screenRef = useRef<Mesh>(null);
   const { camera } = useThree();

   // Expose headRef to parent
   useImperativeHandle(ref, () => internalHeadRef.current, []);

   // Expose screen control functions
   const [avyScreenWorkTexture, setAvyScreenWorkTexture] = useState<Texture | null>(null)
   useEffect(() => update({ changeAvyScreenWorkTexture: setAvyScreenWorkTexture }), [])

   // Screen Noise
   const noiseIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
   const enableNoise = () => {
      if (noiseIntervalRef.current != null) return
      avyScreenMaterialRef.current.map = textures.avyScreenNoise
      avyScreenMaterialRef.current.map.wrapS = RepeatWrapping
      avyScreenMaterialRef.current.map.wrapT = RepeatWrapping

      noiseIntervalRef.current = setInterval(() => {
         const getOffset = () => (Math.random() * 2) - 1
         if (avyScreenMaterialRef.current.map != null) avyScreenMaterialRef.current.map.offset.set(getOffset(), getOffset())
      }, 25)
   }
   const disableNoise = () => {
      if (noiseIntervalRef.current != null) clearInterval(noiseIntervalRef.current)
      noiseIntervalRef.current = null
   }

   // Avy Screen Material
   const avyScreenMaterialRef = useRef(new MeshStandardMaterial({ color: 'white' }))
   const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
   useEffect(() => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout))

      enableNoise()

      timeoutsRef.current.push(setTimeout(() => {
         disableNoise()
         if (avyScreenWorkTexture != null) avyScreenMaterialRef.current.map = avyScreenWorkTexture
         else avyScreenMaterialRef.current.map = new Texture()
      }, (200)));
   }, [avyScreenWorkTexture])

   // HEAD POSITION
   const positionRef = useRef(new Vector3(-2.5, visible ? 0 : 6, -7.5))
   useEffect(() => {
      if (!internalHeadRef.current) return;

      const toUp = gsap.to(positionRef.current, {
         y: 6,
         duration: 0.5,
         paused: true,
         ease: "power2.in",
      });
      const toMiddle = gsap.to(positionRef.current, {
         y: 0,
         duration: 1,
         paused: true,
         ease: "power2.out",
      });

      if (!visible) {
         toUp.play();
      } else {
         toMiddle.play();
      }

      return () => {
         toUp.kill();
         toMiddle.kill();
      };
   }, [visible]);

   /**
    * UseFrame
    */
   const raycasterRef = useRef(new Raycaster())
   useFrame((_, delta) => {
      if (cursorFollower.current == null) return
      const ndc = getNDC();
      raycasterRef.current.setFromCamera(new Vector2(ndc.x, ndc.y), camera);
      const intersects = raycasterRef.current.intersectObject(receiverPlaneRef.current!);
      const currentPlaneIntersect = intersects[0].point;

      // Rotation
      const effectiveFollowerPosition = cursorFollower.current!.position.lerp(currentPlaneIntersect, delta * 6);
      cursorFollower.current.position.copy(effectiveFollowerPosition);
      internalHeadRef.current!.lookAt(cursorFollower.current!.position);

      // Position
      internalHeadRef.current!.position.copy(positionRef.current)
   });

   return (
      <>
         {/* Cursor follower */}
         <mesh ref={cursorFollower} position={[0, 0, 4.8]} castShadow receiveShadow>
            {/* Debug geometry if needed */}
         </mesh>

         <mesh ref={receiverPlaneRef} position={[0, 0, -1]} visible={false}>
            <planeGeometry args={[10, 10]} />
         </mesh>

         {/* Avy head with screen */}
         <Float speed={5} rotationIntensity={0.1} floatingRange={[-0.1, 0.1]}>
            <group ref={internalHeadRef} position={[-2.5, 0, -7.5]} scale={1.6}>
               <AvyHeadModel />

               {/* Blue screen plane parented to head */}
               <mesh ref={screenRef} position={[0, -0.085, 0.64]} material={avyScreenMaterialRef.current} receiveShadow>
                  <planeGeometry args={[1.4, 1.3]} />
               </mesh>
            </group>
         </Float>
      </>
   );
});

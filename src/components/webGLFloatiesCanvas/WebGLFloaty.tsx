import { BallCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Color, Material, Mesh, PlaneGeometry, Vector3 } from "three";
import { getRandomPosition } from "../../functions/3d";
import { useGlobal } from "../../stores/global";
import { AudioPlayer } from "../../functions/audio";
import gsap from "gsap";
import { usePersistentGlobal } from "../../stores/persistentGlobal";

const floatySizes = ['small', 'medium', 'big'] as const
type FloatySize = typeof floatySizes[number]

const spawningMods = ['strips', 'everywhere'] as const
type SpawningMod = typeof spawningMods[number]

const audioPlayer = new AudioPlayer(20);

export default function WebGLFloaty({
   spawningMode,
   uniqueKey,
   edgeBody,
   onRemove,
   spawnAt,
   materials,
   planeGeometry,
   globalScale = 1,
   xScreenLimit,
   yScreenLimit,
   floatySpawningSpace
}: {
   readonly spawningMode: SpawningMod,
   readonly uniqueKey: number,
   readonly edgeBody: RapierRigidBody,
   readonly onRemove: (key: number) => void,
   readonly spawnAt: 'random' | 'edge'
   readonly materials: { small: Material[], medium: Material[], big: Material[] }
   readonly planeGeometry: PlaneGeometry
   readonly globalScale?: number
   readonly xScreenLimit: number
   readonly yScreenLimit: number
   readonly floatySpawningSpace: number
}) {
   const { floatiesColor, globalStirrerBody, enteredApplication, update } = useGlobal()
   const { playSoundEffects } = usePersistentGlobal()
   const bodyRef = useRef(null) as RefObject<RapierRigidBody | null>
   const meshRef = useRef<Mesh>(null)

   // Collision detection
   const removeFloaty = () => { onRemove(uniqueKey) }
   const onCollisionEnter = (collision: any) => {
      const otherBody = collision.other.rigidBody
      if (otherBody.handle === edgeBody.handle) removeFloaty()
      if (globalStirrerBody != null && otherBody.handle === globalStirrerBody.handle) {
         if (enteredApplication && playSoundEffects) audioPlayer.playSound("/audio/short_hit.mp3", [0.05, 0.1], [0.8, 1.5]);

         if (meshRef.current) {
            const mat = meshRef.current.material as Material & { color: Color }
            // Use the current floaty color as baseline
            const originalColor = new Color().set(floatiesColor)
            // Make it darker and a bit reddish
            const hitColor = originalColor.clone().multiplyScalar(0.5).lerp(new Color(0, 1, 0.8), 0.4) // add some red (40% blend)
            // Cancel ongoing tweens before starting a new one
            gsap.killTweensOf(mat.color)
            // Apply hit color instantly
            mat.color.copy(hitColor)
            // Animate back to original
            gsap.to(mat.color, { r: originalColor.r, g: originalColor.g, b: originalColor.b, duration: 0.8, ease: "power2.out" })
         }
      }
   }

   // Size selection
   const getSize = () => {
      const r = Math.random()
      return r < 0.5 ? "medium" : "big"
   }
   const sizeRef = useRef<FloatySize>(getSize())

   // Rotation
   const rotationRef = useRef<[number, number, number]>([0, 0, Math.random() * Math.PI * 2])

   // Material
   const material = useMemo(() => {
      let materialsArray
      if (sizeRef.current === 'small') materialsArray = materials.small
      else if (sizeRef.current === 'medium') materialsArray = materials.medium
      else materialsArray = materials.big

      const materialIndex = Math.floor(Math.random() * materialsArray.length)
      const baseMaterial = materialsArray[materialIndex] as Material & { color: Color }

      const clonedMaterial = baseMaterial.clone() as Material & { color: Color }
      clonedMaterial.color = new Color().set(floatiesColor)

      return clonedMaterial
   }, [materials, sizeRef.current, floatiesColor])

   // Scales
   const biggestFloatySizeRef = useRef(0.4 * globalScale)
   const bodyScale = useMemo(() => {
      let toReturn
      if (sizeRef.current === 'small') toReturn = 0.15 * globalScale;
      else if (sizeRef.current === 'medium') toReturn = 0.25 * globalScale;
      else if (sizeRef.current === 'big') toReturn = biggestFloatySizeRef.current;
      else throw new Error('unrecognized floaty size');
      update({ biggestFloatySize: biggestFloatySizeRef.current })
      return toReturn
   }, [sizeRef.current]);

   // Position
   const getFloatyPosition = () => {
      if (spawnAt === 'random' && spawningMode === 'everywhere') return getRandomPosition(yScreenLimit, xScreenLimit + floatySpawningSpace, -yScreenLimit, -xScreenLimit, 0, 0)
      else if (spawnAt === 'edge' && spawningMode === 'everywhere') return getRandomPosition(yScreenLimit, xScreenLimit + floatySpawningSpace, -yScreenLimit, xScreenLimit + biggestFloatySizeRef.current, 0, 0)
      else if (spawnAt === 'random' && spawningMode === 'strips') {
         const topPart = Math.random() < 0.5
         if (topPart) return getRandomPosition(8, 18, 3.5, -17, 0, 0)
         else return getRandomPosition(-3.5, 18, -8, -17, 0, 0)
      }
      else if (spawnAt === 'edge' && spawningMode === 'strips') {
         const topPart = Math.random() < 0.5
         if (topPart) return getRandomPosition(8, 18, 3.5, 17, 0, 0)
         else return getRandomPosition(-3.5, 18, -8, 17, 0, 0)
      }
      else throw new Error('unexpected spawnAt value')
   }
   const randomPosition = useRef(getFloatyPosition())

   // Force
   useEffect(() => {
      if (bodyRef.current == null) return
      bodyRef.current.addForce(new Vector3(-5, 0, 0), true)
   }, [])

   return (
      <RigidBody
         ref={bodyRef}
         canSleep={true}
         rotation={rotationRef.current}
         onCollisionEnter={onCollisionEnter}
         position={randomPosition.current}
         restitution={0}
         colliders={false}
         linearDamping={8}
         angularDamping={8}
         type="dynamic"
         gravityScale={0}
         enabledTranslations={[true, true, false]}
         enabledRotations={[false, false, true]}
      >
         <BallCollider args={[bodyScale]} mass={0.5} />
         <mesh ref={meshRef} material={material} geometry={planeGeometry} scale={globalScale} />
      </RigidBody>
   )
}

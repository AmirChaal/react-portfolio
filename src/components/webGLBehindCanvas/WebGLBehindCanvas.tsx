import AvyHead from "../AvyHead/AvyHead";
import { Canvas } from '@react-three/fiber'

export function WebGLBehindCanvas() {
   return (
      <Canvas id="webGL-behind-canvas" className="h-full w-full absolute">
         <directionalLight position={[0, 3, 3]} />
         <AvyHead />
      </Canvas>
   )
}

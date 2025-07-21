import AvyHead from "../AvyHead/AvyHead";
import { Canvas } from '@react-three/fiber'
import { useRef } from "react";
import { BoxGeometry, MeshStandardMaterial } from "three";

export function WebGLBehindCanvas() {
   return (
      <Canvas id="webGL-behind-canvas" className="h-full w-full absolute" camera={{ fov: 30 }}>
         <ambientLight args={['#ffffff', 0.5]} />
         <directionalLight args={['#ffffff', 3]} position={[0, 3, 3]} />
         <AvyHead />
      </Canvas>
   )
}

import { Canvas } from "@react-three/fiber";
import WebGLFloatiesPhysicsWrapper from "./WebGLFloatiesPhysicsWrapper";

export default function WebGLFloatiesCanvas() {

   return (
      <Canvas frameloop="always" id="webGL-floaties-canvas " className="h-full w-full absolute!" orthographic camera={{ zoom: 60, position: [0, 0, 10] }}   >
         <WebGLFloatiesPhysicsWrapper />
      </Canvas>
   )
}
import { Physics } from "@react-three/rapier";
import WebGLFloaties from "./WebGLFloaties";

export default function WebGLFloatiesPhysicsWrapper() {

   return (
      <Physics >
         <WebGLFloaties />
      </Physics>
   )
}
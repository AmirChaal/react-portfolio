import ProximityNavigation from "./ProximityNavigation/ProximityNavigation";
import { Canvas } from '@react-three/fiber'
import AvyHead from "./AvyHead/AvyHead";

export default function HomeComponent() {
   return (
      <>
         <Canvas className="h-full w-full absolute">
            <directionalLight position={[0, 3, 3]} />
            <AvyHead />
         </Canvas>
         <div className="absolute bottom-0 left-0 right-0 h-[10em] flex justify-center items-center">
            <ProximityNavigation />
         </div>
      </>
   );
}

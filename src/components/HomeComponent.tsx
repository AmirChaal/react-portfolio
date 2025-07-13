import ProximityNavigation from "./ProximityNavigation/ProximityNavigation";

export default function HomeComponent() {
   return (
      <>
         <mesh>
            <boxGeometry />
            <meshBasicMaterial color="red" />
         </mesh>
         <div className="h-full w-full">
            <div className="absolute bottom-0 left-0 right-0 h-[10em] flex justify-center items-center">
               <ProximityNavigation />
            </div>
         </div>
      </>
   );
}

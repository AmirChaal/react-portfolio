import HomeText from "./HomeText";
import ProximityNavigation from "./ProximityNavigation/ProximityNavigation";

export default function HomeComponent() {
   return (
      <>
         <div className="absolute top-0 left-0 h-full w-[calc(100%-10em)] flex items-center ml-[10em]">
            <HomeText />
         </div>
         {/* <div className="absolute bottom-0 left-0 right-0 h-[10em] flex justify-center items-center">
            <ProximityNavigation />
         </div> */}
      </>
   );
}

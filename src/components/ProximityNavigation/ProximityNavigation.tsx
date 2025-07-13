import HomeIcon from "../icons/HomeIcon";
import ProximityNavigationElement from "./ProximityNavigationElement";

export default function ProximityNavigation() {
   return (
      <div className="flex gap-[2em]">
         <ProximityNavigationElement Icon={HomeIcon} label="accueil" />
         <ProximityNavigationElement Icon={HomeIcon} label="travaux" />
         <ProximityNavigationElement Icon={HomeIcon} label="à propos" />
      </div>
   )
}

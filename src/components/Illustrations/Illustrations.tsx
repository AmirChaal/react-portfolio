import AppearingContent from "../AppearingContent";
import IllustrationButton from "./IllustrationButton";
import { getIllustrationsData } from "../../functions/illustrations";

export default function Illustrations({ visible }: { visible: boolean }) {
   const imageObjects = getIllustrationsData()

   return (
      <AppearingContent visible={visible} className="absolute top-0 left-0 h-full w-full flex justify-center px-[1em] min-[700px]:px-[5em] pt-[7em] pb-[4em] min-[1000px]:pb-[7em] min-[700px]:pt-[9em]" >
         <div className="grid grid-cols-1 min-[550px]:grid-cols-2 min-[1000px]:grid-cols-3 min-[1200px]:grid-cols-4 gap-[1em] items-start justify-center content-start h-full w-full min-[1000px]:w-auto rounded-[0.5em] overflow-auto my-scrollable">
            {imageObjects.map(imageObject => (
               <IllustrationButton imagePath={imageObject.path} imageId={imageObject.id} key={imageObject.id} />
            ))}
         </div>
      </AppearingContent>
   )
}
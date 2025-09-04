import AppearingContent from "../AppearingContent";
import IllustrationButton from "./IllustrationButton";
import { getIllustrationsData } from "../../functions/illustrations";

export default function Illustrations({ visible }: { visible: boolean }) {
   const imageObjects = getIllustrationsData()

   return (
      <AppearingContent visible={visible} className="absolute top-0 left-0 h-full w-full flex justify-center px-[1em] min-[700px]:px-[5em] pt-[7em] min-[700px]:pt-[9em]" >
         <div className="min-[950px]:flex flex-wrap grid grid-cols-1 min-[550px]:grid-cols-2 gap-[1em] items-start justify-center content-start h-full w-full max-w-[70em] rounded-[0.5em] pb-[3em] overflow-auto my-scrollable">
            {imageObjects.map(imageObject => (
               <IllustrationButton imagePath={imageObject.path} imageId={imageObject.id} key={imageObject.id} />
            ))}
         </div>
      </AppearingContent>
   )
}
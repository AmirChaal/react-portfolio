import AppearingContent from "../AppearingContent";
import IllustrationButton from "./IllustrationButton";
import { getIllustrationsData } from "../../functions/illustrations";

export default function Illustrations({ visible }: { visible: boolean }) {
   const imageObjects = getIllustrationsData()

   return (
      <>
         <AppearingContent visible={visible} >
            <div className="absolute top-0 left-0 h-full w-full mt-[20em] flex justify-center items-center">
               <div className="flex flex-wrap gap-[1em] justify-center w-[80em]">
                  {imageObjects.map(imageObject => (
                     <IllustrationButton imagePath={imageObject.path} key={imageObject.id} />
                  ))}
               </div>
            </div>
         </AppearingContent>
      </>
   )
}
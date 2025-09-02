import AppearingContent from "../AppearingContent";
import IllustrationButton from "./IllustrationButton";
import { getIllustrationsData } from "../../functions/illustrations";

export default function Illustrations({ visible }: { visible: boolean }) {
   const imageObjects = getIllustrationsData()

   return (
      <>
         <AppearingContent visible={visible} className="absolute top-0 left-0 h-full w-full flex justify-center items-center" >
            <div className="flex flex-wrap gap-[1em] items-start justify-center h-fit w-[calc(100%-40em)]">
               {imageObjects.map(imageObject => (
                  <IllustrationButton imagePath={imageObject.path} imageId={imageObject.id} key={imageObject.id} />
               ))}
            </div>
         </AppearingContent>
      </>
   )
}
import AppearingContent from "../AppearingContent";
import IllustrationButton from "./IllustrationButton";
import { getIllustrationsData } from "../../functions/illustrations";
import type { ComponentPropsWithoutRef } from "react";

export default function Illustrations({ visible }: { visible: boolean }) {
   const imageObjects = getIllustrationsData()

   return (
      <>
         <AppearingContent visible={visible}  >
            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
               <div className="flex flex-wrap gap-[1em] mt-[20em] justify-center h-full w-[calc(100%-40em)]">
                  {imageObjects.map(imageObject => (
                     <IllustrationButton imagePath={imageObject.path} imageId={imageObject.id} key={imageObject.id} />
                  ))}
               </div>
            </div>
         </AppearingContent>
      </>
   )
}
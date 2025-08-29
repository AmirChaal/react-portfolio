import { useMemo, useState } from "react"
import { useParams } from "react-router"
import { getIllustrationFromId } from "../../functions/illustrations"

export default function IllustrationViewer({ visible }: { visible: boolean }) {
   const { thirdParticle: imageId } = useParams()
   if (visible && (imageId == null || isNaN(parseInt(imageId)))) throw new Error("component is visible but third particle of url isn't image id")

   const imageObject = useMemo(() => {
      if (imageId == null) return null
      const imageObject = getIllustrationFromId(imageId)
      return imageObject
   }, [imageId])

   return (
      <>
         {imageObject && <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
            <img className="h-full w-full" src={imageObject.path} alt="" />
         </div>}
      </>
   )
}
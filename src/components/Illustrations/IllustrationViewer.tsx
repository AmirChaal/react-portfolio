import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { getIllustrationFromId, getIllustrationName } from "../../functions/illustrations"
import { goToIllustrations } from "../../functions/navigation"
import AppearingContent from "../AppearingContent"
import { appViewAppearanceDelay } from "../App"
import IconButton from "../IconButton"
import { useGlobal } from "../../stores/global"
import PixelDownloadIcon from "../icons/PixelDownloadIcon"
import PixelCloseIcon from "../icons/PixelCloseIcon"
import DownloadIcon from "../icons/DownloadIcon"
import CloseIcon from "../icons/CloseIcon"
import CopyIcon from "../icons/CopyIcon"
import { addNotification } from "../../functions/notification"
import { copyImageIntoClipboard } from "../../functions/file"
import { image } from "motion/react-client"

export default function IllustrationViewer({ visible }: { visible: boolean }) {
   const { thirdParticle: imageId } = useParams()
   const navigate = useNavigate()
   const global = useGlobal()
   const { backgroundColor } = global

   // Effective imageId, when imageId becomes null, effectiveImageId becomes null with a delay to let the dissapearing animation play out
   const [effectiveImageId, setEffectiveImageId] = useState<null | number>(null)
   useEffect(() => {
      let timeoutId = null
      if (imageId != null) {
         const parsedImageId = parseInt(imageId)
         if (!isNaN(parsedImageId)) setEffectiveImageId(parsedImageId)
      } else {
         timeoutId = setTimeout(() => {
            setEffectiveImageId(null)
         }, appViewAppearanceDelay)
      }
      return () => {
         if (timeoutId != null) clearTimeout(timeoutId)
      }
   }, [imageId])

   const imageObject = useMemo(() => {
      if (effectiveImageId == null) return null
      const imageObject = getIllustrationFromId(effectiveImageId)
      return imageObject
   }, [effectiveImageId])

   const onClickDarken = () => {
      goToIllustrations(navigate)
   }

   const onClickClose = () => {
      goToIllustrations(navigate)
   }

   const onClickDownload = () => {
      if (imageObject == null) return
      const link = document.createElement("a")
      link.href = imageObject.path // placeholder image
      link.download = getIllustrationName(imageObject)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
   }

   const onClickCopy = async () => {
      if (!imageObject) return
      try {
         await copyImageIntoClipboard(imageObject.path)
         addNotification(global.getNotifications, global.update, <CopyIcon />, "Image copiée")
      } catch (err) {
         console.error("Failed to copy image:", err)
         addNotification(global.getNotifications, global.update, <CopyIcon />, "Échec de la copie")
      }
   }

   return (
      <>
         <div onClick={onClickDarken} className="z-[100] absolute top-0 left-0 h-full w-full bg-black opacity-[0.5]" style={{ transition: `all ${appViewAppearanceDelay}ms`, opacity: visible ? 0.8 : 0, pointerEvents: visible ? 'auto' : 'none' }} />
         <AppearingContent visible={visible} className="z-[101] absolute h-full w-full top-0 left-0 flex flex-col min-[1000px]:flex-row gap-[1em] justify-center items-center pointer-events-none!">
            {imageObject && <div className="h-[85%] min-[1000px]:h-[95%] w-[95%] min-[1000px]:w-[75%] overflow-hidden">
               <img className="h-full w-full object-contain shadow-[0_0_25px_0_rgba(0,0,0,0.4)] pointer-events-auto" src={imageObject.path} alt="" />
            </div>}
            <div className="flex flex-row min-[1000px]:flex-col items-center gap-[0.5em] min-[1000px]:h-[95%]">
               <IconButton onClick={onClickClose} iconComponent={<CloseIcon />} style={{ pointerEvents: visible ? 'auto' : 'none' }} />
               <div className="max-[1000px]:border-r-[1px] min-[1000px]:border-b-[1px] max-[1000px]:h-[2.5em] min-[1000px]:w-[3em]" style={{ borderColor: backgroundColor }} />
               <IconButton onClick={onClickDownload} iconComponent={<DownloadIcon />} style={{ pointerEvents: visible ? 'auto' : 'none' }} />
               <div className="max-[1000px]:border-r-[1px] min-[1000px]:border-b-[1px] max-[1000px]:h-[2.5em] min-[1000px]:w-[3em]" style={{ borderColor: backgroundColor }} />
               <IconButton onClick={onClickCopy} iconComponent={<CopyIcon />} style={{ pointerEvents: visible ? 'auto' : 'none' }} />
            </div>
         </AppearingContent>
      </>
   )
}
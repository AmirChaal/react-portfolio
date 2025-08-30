import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { goToIllustrationViewer } from "../../functions/navigation"

export default function IllustrationButton({ imagePath, imageId }: { imagePath: string, imageId: number }) {
   const navigate = useNavigate()
   const onClick = () => goToIllustrationViewer(navigate, imageId)

   return (
      <>
         <div onClick={onClick} className="cursor-pointer h-[10em] w-[15em] rounded-[0.5em] bg-cover bg-center" style={{ background: `url("${imagePath}"`, backgroundSize: 'cover', backgroundPosition: "center" }} />
      </>
   )
}
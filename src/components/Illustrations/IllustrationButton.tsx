import { useEffect, useRef } from "react"

export default function IllustrationButton({ imagePath }: { imagePath: string }) {
   return (
      <>
         <div className="cursor-pointer h-[10em] w-[15em] rounded-[0.5em] bg-cover bg-center" style={{background: `url("${imagePath}"`, backgroundSize: 'cover', backgroundPosition: "center"}} />
      </>
   )
}
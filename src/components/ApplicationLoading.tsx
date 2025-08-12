import { useEffect } from "react"
import { useGlobal } from "../stores/global"

export default function ApplicationLoading({ active }: { active: boolean }) {

   useEffect(() => {

   }, [active])

   return <div className="absolute h-full w-full flex justify-center items-center">
      <p className="font-jersey10 text-[2em] tracking-[0.1em]">LOADING...</p>
   </div>
}
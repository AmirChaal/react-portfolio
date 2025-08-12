import gsap from "gsap"
import { useEffect, useRef } from "react"

export default function AppearingText({ text, active }: { text: string, active: boolean }) {

   const opacity = useRef(active ? 1 : 0)
const y = useRef(active)

   const appearAnimation = gsap.to({ duration: 0.5 })

   const appear = () => {

   }
   const dissapear = () => {

   }

   useEffect(() => {
      if (active === true) {

      }
   }, [active])

   return (
      <p>{text}</p>
   )
}
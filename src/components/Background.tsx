import { useEffect, useState } from "react"

export default function Background() {
   const [translate, setTranslate] = useState({ x: 0, y: 0 })

   useEffect(() => {
      setInterval(() => {
         const getRandom = () => Math.random() * -50
         setTranslate({ x: getRandom(), y: getRandom() })
      }, 80);
   }, [])

   const backgroundStyle = { transform: `translate(${translate.x}%, ${translate.y}%)` }

   return (
      <div className="absolute h-full w-full overflow-hidden opacity-[0.125]">
         <div className="absolute h-[600%] w-[600%] bg-[url('noise.png')] mix-blend-screen" style={backgroundStyle} />
      </div>
      // <img src="/noise.png" className="absolute h-full w-full bg-repeat" />
   )
}
import { useEffect, useState } from "react"
import noiseImage from '/noise.png'

export default function Background() {
   const [translate, setTranslate] = useState({ x: 0, y: 0 })

   useEffect(() => {
      setInterval(() => {
         const getRandom = () => Math.random() * -50
         setTranslate({ x: getRandom(), y: getRandom() })
      }, 150);
   }, [])

   const backgroundStyle = {
      transform: `translate(${translate.x}%, ${translate.y}%)`,
      backgroundImage: `url(${noiseImage})`
}

return (
   <div className="absolute h-full w-full overflow-hidden opacity-[0.125]">
      <div className="absolute h-[600%] w-[600%] mix-blend-screen" style={backgroundStyle} />
   </div>
)
}
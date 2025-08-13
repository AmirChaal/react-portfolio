import { useNavigate } from "react-router"
import AppearingContent from "./AppearingContent"

export default function NavigationBar({ visible }: { visible: boolean }) {
   const navigate = useNavigate()

   const homeOnClick = () => {
      navigate('/home')
   }

   return (
      <AppearingContent visible={visible} className="z-10 relative">
         <div className="absolute top-0 left-0 right-0 h-[4em] px-[2em] flex justify-between items-center font-micro5 text-4xl">
            <p onClick={homeOnClick}>Home</p>
            <div className="flex items-center gap-[1em]">
               <p>nightmode</p>
               <p>menu</p>
            </div>
         </div>
      </AppearingContent>
   )
}
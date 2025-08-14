import { useNavigate } from "react-router"
import AppearingContent from "./AppearingContent"
import { goToAbout, goToHome, goToWorks } from "../functions/navigation"

export default function NavigationBar({ visible }: { visible: boolean }) {
   const navigate = useNavigate()

   return (
      <AppearingContent visible={visible} className="z-10 relative">
         <div className="absolute top-0 left-0 right-0 h-[4em] px-[2em] flex justify-between items-center font-micro5 text-4xl">
            <button onClick={() => goToHome(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em]">Accueil</button>
            <div className="flex items-center gap-[1em]">
               <button onClick={() => goToWorks(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em]">Travaux</button>
               <button onClick={() => goToAbout(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em]">À propos</button>
            </div>
         </div>
      </AppearingContent>
   )
}
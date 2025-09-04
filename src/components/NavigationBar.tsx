import { useNavigate } from "react-router"
import AppearingContent from "./AppearingContent"
import { goToAbout, goToHome, goToWorks } from "../functions/navigation"

export default function NavigationBar({ visible }: { visible: boolean }) {
   const navigate = useNavigate()

   return (
      <AppearingContent visible={visible} className="z-100 absolute top-0 left-0 right-0 h-[4em] px-[1em] min-[700px]:px-[2em] flex min-[700px]:gap-[1.5em] justify-between items-center font-micro5 text-[1.75em] min-[700px]:text-[2.25em]">
         <div className="min-[700px]:flex-1">
            <button onClick={() => goToHome(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em] whitespace-nowrap">Accueil</button>
         </div>
         <button onClick={() => goToWorks(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em] whitespace-nowrap">Travaux</button>
         <button onClick={() => goToAbout(navigate)} className="cursor-pointer px-[0.5em] py-[0.1em] whitespace-nowrap">À propos</button>
      </AppearingContent>
   )
}
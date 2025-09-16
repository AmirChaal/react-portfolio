import { useGlobal } from "../stores/global"
import AppearingContent from "./AppearingContent"
import AppearingList from "./AppearingList"

export default function EnterApplication({ visible }: { visible: boolean }) {
   const { update, inputMethod } = useGlobal()
   const onEnterClick = () => {
      update({ enteredApplication: true })
   }

   return (
      <div className="z-500 absolute top-0 left-0 h-full w-full flex justify-center items-center cursor-pointer" onClick={onEnterClick} style={{ pointerEvents: visible ? 'auto' : 'none' }}>
         <AppearingContent className="flex flex-col gap-[0.5em] justify-center items-center" visible={visible}>
            <div className="h-[8em]">
               <img className="h-full" src="/portfolio_logo_thick.png" alt="" draggable={false} />
            </div>
            <p className="font-jersey10 text-[2em] tracking-[0.1em]">
               {inputMethod === "cursor" && "CLIQUEZ POUR ENTRER"}
               {inputMethod === "touch" && "APPUYEZ POUR ENTRER"}
            </p>
         </AppearingContent>
      </div>

   )
}
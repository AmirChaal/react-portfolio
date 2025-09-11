import { useGlobal } from "../stores/global"
import AppearingContent from "./AppearingContent"

export default function EnterApplication({ visible }: { visible: boolean }) {
   const { update } = useGlobal()
   const onEnterClick = () => {
      update({ enteredApplication: true })
   }

   return (
      <AppearingContent className="z-500 absolute top-0 left-0 h-full w-full flex justify-center items-center cursor-pointer" onClick={onEnterClick} visible={visible}>
         <p className="font-jersey10 text-[2em] tracking-[0.1em]">CLIQUEZ POUR ENTRER</p>
      </AppearingContent>
   )
}
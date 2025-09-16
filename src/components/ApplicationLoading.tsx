import { useGlobal } from "../stores/global"
import AppearingContent from "./AppearingContent"
import AppearingList from "./AppearingList"

export default function ApplicationLoading({ visible }: { visible: boolean }) {
   const { textColor } = useGlobal()

   return <div className="absolute h-full w-full flex justify-center items-center">
      <AppearingContent visible={visible}>
         {/* Spinner */}
         <div className="flex justify-center items-center gap-[1em]">
            <div className={`w-[2em] h-[2em] border-4 border-t-transparent border-[${textColor}] rounded-full animate-spin`}></div>
            <p className="font-jersey10 text-[2em] tracking-[0.1em] ">
               LOADING...
            </p>
         </div>
      </AppearingContent>
   </div>
}
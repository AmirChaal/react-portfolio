import { useGlobal } from "../../stores/global";
import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";

export default function AboutComponent({ visible }: { visible: boolean }) {
   const { textColor } = useGlobal()

   return (
      <>
         <div className="absolute top-0 left-0 h-full w-full flex items-start justify-center pointer-events-none">
            <AppearingContent visible={visible} className="absolute left-[1em] right-[1em] top-[6.5em] h-[30em] rounded-[1em] overflow-hidden" style={{ background: textColor }}>
               <div className="absolute w-[120%] left-[10em] top-[-7em] translate-x-[-50%]" >
                  <img src="/avy_about.png" alt="" className="h-full w-full" />
               </div>
            </AppearingContent>
            <AppearingList visible={visible} className="absolute left-[1em] right-[1em] pt-[25em] text-[1.5em] font-jersey10">
               <AppearingContent>
                  <p className="text-[1.8em] mb-[0em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
               </AppearingContent>
               <AppearingContent>
                  <p className="leading-[0.9em] text-[1em] text-justify">
                     Je suis un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                     Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                  </p>
               </AppearingContent>
            </AppearingList>
         </div>
      </>
   )
}

// export default function AboutComponent({ visible }: { visible: boolean }) {
//    return (
//       <>
//          <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center gap-[2em] text-[2.2em] font-jersey10 overflow-hidden pointer-events-none">
//             <AppearingContent visible={visible} className="h-[120%]" >
//                <img src="/avy_about.png" alt="" className="h-full w-full" />
//             </AppearingContent>
//             <div className="w-[20em]">
//                <AppearingList visible={visible}>
//                   <AppearingContent>
//                      <p className="text-[2em] mb-[-0.2em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
//                   </AppearingContent>
//                   <AppearingContent>
//                      <p className="leading-[1em] text-[0.8em] text-justify">
//                         Je suis un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
//                         Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
//                      </p>
//                   </AppearingContent>
//                </AppearingList>
//             </div>
//          </div>
//       </>
//    )
// }
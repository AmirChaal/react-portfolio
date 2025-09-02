import { useGlobal } from "../../stores/global";
import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";

export default function AboutComponent({ visible }: { visible: boolean }) {
   const { textColor, deviceSize } = useGlobal()

   return (
      <>
         {deviceSize.width < 1100 && <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center flex-col pointer-events-none">
            <AppearingList visible={visible} className="font-jersey10 h-full w-full max-w-[40em] px-[1.5em] mt-[6.8em] min-[700px]:mt-[8.5em] mb-[3em] flex flex-col">
               <AppearingContent visible={visible} className="mb-[0.5em] rounded-[1em] overflow-hidden flex-1" style={{ background: textColor }}>
                  <div className="absolute w-[35em] left-[50%] top-[-6rem] translate-x-[-50%]">
                     <img src="/avy_about.png" alt="" className="h-full w-full" />
                  </div>
               </AppearingContent>
               <AppearingContent className="flex-0">
                  <p className="text-[3em] mb-[-0.3em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
               </AppearingContent>
               <AppearingContent className="flex-0">
                  <p className="leading-[0.9em] text-[1.5em] text-justify">
                     Je suis un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                     Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                  </p>
               </AppearingContent>
            </AppearingList>
         </div>}
         {deviceSize.width >= 1100 && <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center pointer-events-none">
            <AppearingList visible={visible} className="font-jersey10 flex items-center gap-[2em]">
               <AppearingContent visible={visible} className="rounded-[1em] overflow-hidden h-[30em] w-[30em]" style={{ background: textColor }}>
                  <div className="absolute w-[30rem] left-[50%] top-[-6rem] translate-x-[-50%]">
                     <img src="/avy_about.png" alt="" className="h-full w-full" />
                  </div>
               </AppearingContent>
               <AppearingContent className="h-[20em] w-[37.15em]">
                  <p className="text-[5em] mb-[-0.3em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
                  <p className="leading-[0.9em] text-[1.8em] text-justify">
                     Je suis un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                     Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                  </p>
               </AppearingContent>
            </AppearingList>
         </div>}
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
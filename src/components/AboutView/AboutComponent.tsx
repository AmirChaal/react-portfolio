import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";

export default function AboutComponent({ visible }: { visible: boolean }) {
   return (
      <>
         <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center gap-[2em] text-[2.2em] font-jersey10 overflow-hidden" style={{ pointerEvents: visible ? 'auto' : 'none' }}>
            <AppearingContent visible={visible} className="h-[110%]" >
               <img src="/avy_about.png" alt="" className="h-full w-full" />
            </AppearingContent>
            <div className="w-[20em]">
               <AppearingList visible={visible}>
                  <AppearingContent>
                     <p className="text-[2em] mb-[-0.2em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
                  </AppearingContent>
                  <AppearingContent>
                     <p className="leading-[1em] text-[0.8em] text-justify">
                        Je suis développeur web et illustrateur, passionné par la création de projets uniques qui allient technique et créativité.
                        Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                     </p>
                  </AppearingContent>
               </AppearingList>
            </div>
         </div>
      </>
   )
}
import { useNavigate } from "react-router";
import { useGlobal } from "../../stores/global";
import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";
import PreviousButton from "../PreviousButton";
import TextButton from "../TextButton";
import { useMemo } from "react";

export default function AboutComponent({ visible }: { visible: boolean }) {
   const { textColor, deviceSize } = useGlobal()
   const navigate = useNavigate()

   const previousOnClick = () => navigate('/home')

   const onCVClick = () => {
      window.open('/amir_chaal_cv.pdf', "_blank", "noopener,noreferrer");
   }

   const desktopVisible = useMemo(() => deviceSize.width >= 1200, [deviceSize])

   return (
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
         <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center flex-col ">
            <AppearingList visible={visible && !desktopVisible} className="font-jersey10 h-full w-full max-w-[40em] px-[1.5em] mt-[6.8em] min-[700px]:mt-[8.5em] mb-[4em] flex flex-col">
               <AppearingContent>
                  <PreviousButton className="text-[1.7em] mb-[0.5em] w-fit" onClick={previousOnClick} />
               </AppearingContent>
               <AppearingContent visible={visible} className="mb-[0.5em] rounded-[1em] overflow-hidden flex-1" style={{ background: textColor }}>
                  <div className="absolute w-[150%] left-[50%] top-[-6rem] translate-x-[-50%]">
                     <img src="/avy_about.png" alt="" className="h-full w-full" draggable={false} />
                  </div>
               </AppearingContent>
               <AppearingContent className="flex-0">
                  <p className="text-[2.5em] min-[500px]:text-[3em] mb-[-0.3em] min-[500px]:tracking-[0.047em] text-nowrap">SALUT, JE SUIS AMIR</p>
               </AppearingContent>
               <AppearingContent className="flex-0">
                  <p className="leading-[0.9em] text-[1.5em] text-justify mb-[0.4em]">
                     Un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                     Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                  </p>
                  <TextButton className="text-[1.5em]" onClick={onCVClick} text={"Mon CV"} />
                  <a href="mailto:mohamedamir.chaal@gmail.com" className="text-[1.5em] w-fit">mohamedamir.chaal@gmail.com</a>
               </AppearingContent>
            </AppearingList>
         </div>
         <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
            <AppearingList visible={visible && desktopVisible} className="font-jersey10">
               <AppearingContent className="text-[1.9em] mb-[0.5em] w-fit">
                  <PreviousButton onClick={previousOnClick} />
               </AppearingContent>
               <AppearingContent className="flex items-center gap-[2em]" >
                  <div className="relative rounded-[1em] overflow-hidden h-[30em] w-[30em]" style={{ background: textColor }}>
                     <div className="absolute w-[30rem] left-[50%] top-[-6rem] translate-x-[-50%]">
                        <img src="/avy_about.png" alt="" className="h-full w-full" draggable={false} />
                     </div>
                  </div>
                  <div className="h-[20em] w-[37.15em]">
                     <p className="text-[5em] tracking-[0.047em] leading-[1em]">SALUT, JE SUIS AMIR</p>
                     <p className="leading-[0.9em] text-[1.8em] text-justify mb-[1em]">
                        Un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                        Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                     </p>
                     <TextButton className="text-[1.8em]" onClick={onCVClick} text={"Mon CV"} />
                     <a href="mailto:mohamedamir.chaal@gmail.com" className="text-[1.8em] w-fit">mohamedamir.chaal@gmail.com</a>
                  </div>
               </AppearingContent>
            </AppearingList>
         </div>
      </div>
   )
}
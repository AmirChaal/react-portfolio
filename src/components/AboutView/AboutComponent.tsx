import { useNavigate } from "react-router";
import { useGlobal } from "../../stores/global";
import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";
import PreviousButton from "../PreviousButton";
import TextButton from "../TextButton";
import CopyIcon from "../icons/CopyIcon";
import { addNotification } from "../../functions/notification";
import MailIcon from "../icons/MailIcon";

export default function AboutComponent({ visible }: { visible: boolean }) {
   const { textColor, deviceSize, getNotifications, update } = useGlobal()
   const navigate = useNavigate()

   const previousOnClick = () => navigate('/home')

   const onCVClick = () => {
      window.open('/amir_chaal_cv.pdf', "_blank", "noopener,noreferrer");
   }

   const onCopyEmailClick = async () => {
      await navigator.clipboard.writeText('mohamedamir.chaal@gmail.com')
      addNotification(getNotifications, update, <CopyIcon />, "Email copié")
   }

   return (
      <>
         {deviceSize.width < 1200 && <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center flex-col pointer-events-none">
            <AppearingList visible={visible} className="font-jersey10 h-full w-full max-w-[40em] px-[1.5em] mt-[6.8em] min-[700px]:mt-[8.5em] mb-[4em] flex flex-col">
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
                  <p className="leading-[0.9em] text-[1.5em] text-justify">
                     Je suis un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                     Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                  </p>
               </AppearingContent>
            </AppearingList>
         </div>}
         {deviceSize.width >= 1200 && <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center pointer-events-none">
            <AppearingList visible={visible} className="font-jersey10">
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
                     <p className="text-[5em] mb-[-0.3em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
                     <p className="leading-[0.9em] text-[1.8em] text-justify mb-[1em]">
                        Un développeur web qui fait aussi de l'illustration. Je suis passionné par la création de projets uniques qui allient technique et créativité.
                        Mon objectif est de concevoir des expériences qui racontent une histoire et qui marquent ceux qui les découvrent.
                     </p>
                     <div className="flex justify-between">
                        <TextButton className="text-[1.8em]" onClick={onCVClick} text={"Mon CV"} />
                        <div className="flex gap-[0.5em] items-center">
                           <MailIcon className="h-[2em] cursor-pointer" color={textColor} onClick={onCopyEmailClick} />
                           <p className="text-[1.8em] select-text">mohamedamir.chaal@gmail.com</p>
                        </div>
                     </div>
                  </div>
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
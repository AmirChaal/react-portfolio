import { useNavigate } from "react-router";
import AppearingList from "../AppearingList";
import AppearingContent from "../AppearingContent";
import TextButton from "../TextButton";
import { goToAbout, goToWorks } from "../../functions/navigation";

export default function HomeComponent({ visible }: { visible: boolean }) {
   const navigate = useNavigate();

   return (
      <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center pointer-events-none">
         <AppearingList visible={visible} className="text-[1.3em] min-[500px]:text-[1.7em] min-[800px]:text-[2.2em] font-jersey10 min-[1300px]:w-full min-[1300px]:pl-[10rem]">
            <AppearingContent>
               <p className="text-[2em] mb-[-0.6em] tracking-[0.047em]">HEY, JE SUIS AMIR</p>
            </AppearingContent>
            <AppearingContent>
               <p className="text-[1.1em] tracking-[0.085em]">Développeur web front-end</p>
            </AppearingContent>
            <AppearingContent>
               <div className="flex h-[1.7em] w-full relative">
                  <div className="text-[0.9em] absolute left-[2.95em] top-[50%]">
                     <TextButton className="absolute whitespace-nowrap translate-[-50%]" onClick={() => goToWorks(navigate)} text="Mes travaux" />
                  </div>
                  <div className="text-[0.9em] absolute left-[11.21em] top-[50%]">
                     <TextButton className="absolute whitespace-nowrap translate-[-50%]" onClick={() => goToAbout(navigate)} text="À propos de moi" />
                  </div>
               </div>
            </AppearingContent>
         </AppearingList>
      </div>
   );
}

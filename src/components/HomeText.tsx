import { useNavigate } from "react-router";
import TextButton from "./TextButton";

export default function HomeText() {
   const navigate = useNavigate()

   const worksOnClick = () => {
      navigate('/works');
   }

   const aboutMeOnClick = () => {
      navigate('/about-me');
   }

   return (
      <div className="text-[2.2em] font-jersey10">
         <p className="text-[2em] mb-[-0.6em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
         <p className="mb-[0.1em] tracking-[0.05em]">Développeur full-stack & illustrateur</p>
         <div className="flex w-full relative">
            <div className="absolute left-[2.8em]">
               <TextButton className="absolute whitespace-nowrap translate-x-[-50%]" onClick={worksOnClick} text="Mes travaux" />
            </div>
            <div className="absolute left-[11.3em]">
               <TextButton className="absolute whitespace-nowrap translate-x-[-50%]" onClick={aboutMeOnClick} text="À propos de moi" />
            </div>
         </div>
      </div>
   );
}

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
         <div className="flex justify-around w-full">
            <div className="relative translate-x-[-50%]">
               <TextButton className="absolute whitespace-nowrap" onClick={worksOnClick} text="Mes travaux" />
            </div>
            <div>
               <TextButton className="absolute" onClick={aboutMeOnClick} text="À propos de moi" />
            </div>
         </div>
      </div>
   );
}

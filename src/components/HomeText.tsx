import { useNavigate } from "react-router";

export default function HomeText() {
   const  navigate = useNavigate()

   const worksOnClick = () => {
      navigate('/works');
   }

   const aboutMeOnClick = () => {
      navigate('/about-me');
   }

   return (
      <div className="text-[2.2em] font-jersey10">
         <p className="text-[2em] mb-[-0.6em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
         <p className="mb-[-0.1em] tracking-[0.05em]">Développeur full-stack & illustrateur</p>
         <div className="flex gap-[4.7em]">
            <p onClick={worksOnClick}>Mes travaux</p>
            <p onClick={aboutMeOnClick}>À propos de moi</p>
         </div>
      </div>
   );
}

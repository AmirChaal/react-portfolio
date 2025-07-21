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
      <div className="text-5xl font-micro5">
         <p className="text-[2em] mb-[-0.2em] tracking-[-0.01em]">SALUT, JE SUIS AMIR</p>
         <p className="mb-[0.4em]">Développeur full-stack et illustrateur</p>
         <div className="flex gap-[2.65em]">
            <p onClick={worksOnClick}>Mes travaux</p>
            <p onClick={aboutMeOnClick}>À propos de moi</p>
         </div>
      </div>
   );
}

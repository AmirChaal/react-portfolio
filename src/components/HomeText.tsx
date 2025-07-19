import { useGlobal } from "../stores/global";

export default function HomeText() {
   const { update } = useGlobal()

   const worksOnClick = () => {
      update({ currentView: 'works' })
   }

   const aboutMeOnClick = () => {
      update({ currentView: 'about-me' })
   }

   return (
      <div className="text-5xl font-micro5">
         <p>Salut, je suis Amir.</p>
         <p>Développeur full-stack et illustrateur.</p>
         <div className="flex gap-[1em]">
            <p onClick={worksOnClick}>Mes travaux</p>
            <p>&</p>
            <p onClick={aboutMeOnClick}>À propos de moi</p>
         </div>
      </div>
   );
}

import type { NavigateFunction } from "react-router"
import type { GlobalStore } from "../stores/global"
import { goToIllustrations, goToWorkPortfolio, goToWorkTTRPGAssist } from "./navigation"

export default function getWorksData(navigateFunction: NavigateFunction, textures: GlobalStore["textures"]) {
   return [
      {
         article: true,
         id: 1,
         title: 'Portoflio 2025',
         description:
            `Après avoir suivi la formation Three.js Journey, j'ai voulu me lancer dans un projet qui mobiliserait mes connaissances nouvellement acquises.\n
            J'ai donc conçu un nouveau site portfolio en utilisant React et Three.js afin de mettre en avant mes créations ainsi que mes compétences.`,
         texture: textures.avyScreenPortfolio,
         workClick: () => goToWorkPortfolio(navigateFunction),
         articleClick: () => { window.open('/home', '_blank')?.focus() },
         urlCode: 'portfolio'
      },
      {
         article: true,
         id: 2,
         title: 'Seeker Assist',
         description:
            `Êtant un grand fan de jeu de rôle, je me suis souvent retrouvé insatisfait des outils de gestion disponibles.\n
            C'est ainsi que je me suis lancé dans le développement d'un outil qui répondrait aux besoins de mes tablées de jeu de rôle, à l'aide de Vue.js.`,
         texture: textures.avyScreenSeekerAssist,
         workClick: () => goToWorkTTRPGAssist(navigateFunction),
         articleClick: () => { window.open('test', '_blank')?.focus() },
         urlCode: 'ttrpg-assist'
      },
      {
         article: false,
         id: 3,
         title: 'Illustrations',
         description: '',
         texture: textures.avyScreenIllustrations,
         workClick: () => goToIllustrations(navigateFunction),
         articleClick: () => { window.open('test', '_blank')?.focus() },
      }
   ]
}
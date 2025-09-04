import type { NavigateFunction } from "react-router"
import type { GlobalStore } from "../stores/global"
import { goToIllustrations, goToWorkPortfolio, goToWorkTTRPGAssist } from "./navigation"

export default function getWorksData(navigateFunction: NavigateFunction, textures: GlobalStore["textures"]) {
   return [
      {
         article: true,
         id: 1,
         title: 'Portoflio 2025',
         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis voluptate eum, iste, aliquam obcaecati incidunt velit libero deserunt in delectus non aperiam, labore voluptatibus. Modi explicabo quae vel et rem.',
         texture: textures.avyScreenA,
         workClick: () => goToWorkPortfolio(navigateFunction),
         articleClick: () => { window.open('test', '_blank')?.focus() },
         urlCode: 'portfolio'
      },
      {
         article: true,
         id: 2,
         title: 'TTRPG-Assist',
         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis voluptate eum, iste, aliquam obcaecati incidunt velit libero deserunt in delectus non aperiam, labore voluptatibus. Modi explicabo quae vel et rem.',
         texture: textures.avyScreenB,
         workClick: () => goToWorkTTRPGAssist(navigateFunction),
         articleClick: () => { window.open('test', '_blank')?.focus() },
         urlCode: 'ttrpg-assist'
      },
      {
         article: false,
         id: 3,
         title: 'Illustrations',
         description: '',
         texture: textures.avyScreenC,
         workClick: () => goToIllustrations(navigateFunction),
         articleClick: () => { window.open('test', '_blank')?.focus() },
      }
   ]
}
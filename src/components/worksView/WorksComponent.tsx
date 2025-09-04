import type { Texture } from "three";
import { useGlobal } from "../../stores/global";
import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";
import TextButton from "../TextButton";
import { useEffect, useRef, useState } from "react";
import { goToIllustrations, goToWorkPortfolio } from "../../functions/navigation";
import { useNavigate } from "react-router";
import getWorksData from "../../functions/works";

export default function WorksComponent({ visible }: { visible: boolean }) {
   const { textures, changeAvyScreenWorkTexture } = useGlobal()
   const navigate = useNavigate()
   const worksData = getWorksData(navigate, textures)

   const localChangeAvyScreen = (texture: Texture | null) => {
      if (changeAvyScreenWorkTexture == null) return
      changeAvyScreenWorkTexture(texture)
   }
   const onLeaveWork = () => localChangeAvyScreen(null)
   const onHoverWork = (workData: ReturnType<typeof getWorksData>[number]) => localChangeAvyScreen(workData.texture)

   return (
      <div className="absolute top-0 left-0 h-full w-full flex items-center justify-end pointer-events-none">
         <AppearingList visible={visible} className="text-[2em] min-[500px]:text-[3em] font-jersey10 px-[1em] min-[1100px]:px-0 w-full min-[1100px]:w-[10em] min-[1000px]:mr-[5rem] min-[1300px]:mr-[10rem] min-[1600px]:mr-[20rem]">
            <AppearingContent>
               <p className="pb-[0.6em]">TRAVAUX</p>
               <div className="border-b-[3px] border-b-solid mb-[0.3em] mx-[0.1em]" />
            </AppearingContent>
            {worksData.map(workData => (
               <AppearingContent key={workData.id}>
                  <TextButton onClick={workData.workClick} onMouseEnter={() => onHoverWork(workData)} onMouseLeave={onLeaveWork} className="py-[0.5em] text-[0.7em] tracking-[0.05em] w-full" text={workData.title} />
               </AppearingContent>
            ))}
         </AppearingList>
      </div>
   )
}
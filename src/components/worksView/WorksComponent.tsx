import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";
import TextButton from "../TextButton";

export default function WorksComponent({ visible }: { visible: boolean }) {
   return (
      <div className="absolute top-0 left-0 h-full w-[calc(100%-20em)] flex items-center justify-end mr-[20em] pointer-events-none">
         <div className="text-5xl font-jersey10 w-[10em] pointer-events-auto">
            <AppearingList visible={visible}>
               <AppearingContent>
                  <p className="pb-[0.6em]">TRAVAUX</p>
                  <div className="border-b-[3px] border-b-solid mb-[0.3em] mx-[0.1em]" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em]  w-full" text="Portfolio 2025" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em]  w-full" text="TTRPG-Assist" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em]  w-full" text="Illustrations" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em]  w-full" text="Visual Novel Creator" />
               </AppearingContent>
            </AppearingList>
         </div>
      </div>
   )
}
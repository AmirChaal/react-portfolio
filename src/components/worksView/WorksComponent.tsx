import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";
import TextButton from "../TextButton";

export default function WorksComponent({ visible }: { visible: boolean }) {
   return (
      <div className="absolute top-0 left-0 h-full w-[calc(100%-10em)] flex items-center justify-end mr-[10em] pointer-events-none">
         <div className="text-5xl font-jersey10 w-[15em] pointer-events-auto">
            <AppearingList visible={visible}>
               <AppearingContent>
                  <p className="border-b-[3px] border-b-solid pb-[0.5em]">TRAVAUX</p>
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em] border-b-solid border-b-[3px] w-full" text="Portfolio 2025" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em] border-b-solid border-b-[3px] w-full" text="TTRPG-Assist" />
               </AppearingContent>
               <AppearingContent>
                  <TextButton className="py-[0.5em] text-[0.7em] tracking-[0.05em] border-b-solid border-b-[3px] w-full" text="Visual Novel Creator" />
               </AppearingContent>
            </AppearingList>
         </div>
      </div>
   )
}
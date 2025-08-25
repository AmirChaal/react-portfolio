import AppearingContent from "../AppearingContent"
import OpenInNewIcon from "../icons/openInNewIcon"
import TextButton from "../TextButton"

export default function Article({ visible }: { visible: boolean }) {
   return (
      <>
         <AppearingContent visible={visible} className="absolute h-full w-full top-0 left-0 flex justify-center items-center font-jersey10">
            <div className="w-[80%]">
               <div className="w-[40em]">
                  <div className="flex gap-[0.5em] items-end">
                     <p className="text-[5em] h-full leading-[0.93em]">Portfolio</p>
                     <p className="text-[2em] h-full">2025</p>
                  </div>
                  <p className="text-[1.75em] leading-[0.9em] mb-[0.1em]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque enim praesentium consectetur, eius debitis asperiores qui facere. Ipsum eveniet doloribus, quis quas tempore itaque. Deleniti earum facilis accusamus ex odit!</p>
                  <div className="flex gap-[1em] text-[2em]">
                     <TextButton text="Site web" endIcon={<OpenInNewIcon />} />
                  </div>
               </div>
            </div>
         </AppearingContent>
      </>
   )
}
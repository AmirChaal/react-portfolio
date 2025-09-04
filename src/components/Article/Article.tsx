import AppearingContent from "../AppearingContent"
import PixelOpenInNewIcon from "../icons/PixelOpenInNewIcon"
import TextButton from "../TextButton"

export default function Article({ visible, title, description, buttonClick }: { visible: boolean, title: string, description: string, buttonClick: () => void }) {
   return (
      <div className="absolute h-full w-full top-0 left-0 flex justify-start items-center font-jersey10 pointer-events-none">
         <AppearingContent visible={visible} className="text-[0.8em] min-[500px]:text-[1em] px-[3em] min-[1000px]:ml-[10em] w-full min-[1000px]:w-[40em] text-justify min-[1000px]:text-left">
            <div className="flex gap-[0.5em] items-end">
               <p className="text-[4em] h-full leading-[0.93em]">{title}</p>
               {/* <p className="text-[2em] h-full">2025</p> */}
            </div>
            <p className="text-[1.75em] leading-[0.9em] mb-[0.1em]">{description}</p>
            <div className="flex gap-[1em] text-[2em]">
               <TextButton text="Site web" endIcon={<PixelOpenInNewIcon />} onClick={buttonClick} />
            </div>
         </AppearingContent>
      </div>
   )
}
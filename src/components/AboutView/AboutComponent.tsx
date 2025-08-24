import AppearingContent from "../AppearingContent";
import AppearingList from "../AppearingList";

export default function AboutComponent({ visible }: { visible: boolean }) {
   return (
      <>
         <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center gap-[2em] text-[2.2em] font-jersey10 overflow-hidden" style={{ pointerEvents: visible ? 'auto' : 'none' }}>
            <AppearingContent visible={visible} className="h-[110%]" >
               <img src="avy_about.png" alt="" className="h-full w-full" />
            </AppearingContent>
            <div className="w-[20em]">
               <AppearingList visible={visible}>
                  <AppearingContent>
                     <p className="text-[2em] mb-[-0.2em] tracking-[0.047em]">SALUT, JE SUIS AMIR</p>
                  </AppearingContent>
                  <AppearingContent>
                     <p className="leading-[1em] text-[0.8em] text-justify">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit quam iusto inventore minus provident tenetur dolor consectetur possimus ab, pariatur libero, commodi eius fugit dignissimos illum corporis culpa maxime nesciunt!s</p>
                  </AppearingContent>
               </AppearingList>
            </div>
         </div>
      </>
   )
}
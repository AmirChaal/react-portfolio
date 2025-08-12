import AppearingContent from "./AppearingContent"

export default function ApplicationLoading({ visible }: { visible: boolean }) {

   return <div className="absolute h-full w-full flex justify-center items-center">
      <AppearingContent visible={visible} >
         <p className="font-jersey10 text-[2em] tracking-[0.1em]">LOADING...</p>
      </AppearingContent>
   </div>
}
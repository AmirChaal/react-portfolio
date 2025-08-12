import { useGlobal } from "../stores/global"

export default function Background() {
   const { backgroundColor } = useGlobal()

   return (
      <>
         {/* <div className="absolute h-full w-full bg-[linear-gradient(#EBE1BB_0%,#ece6c2_50%,#ece6c2_50%,#EBE1BB_100%)]" style={{ color: textColor }}> */}
         < div className="absolute h-full w-full" style={{ backgroundColor: backgroundColor }} />
      </>
   )
}
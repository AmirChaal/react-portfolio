import { useGlobal } from "../stores/global"

export default function Copyright() {
   const { deviceSize } = useGlobal()

   return (
      <div className="z-[100] text-[1.5em] absolute top-0 left-0 h-full w-full flex justify-start min-[600px]:justify-center items-end pointer-events-none px-[1em] py-[0.5em] font-micro5">
         {deviceSize.width > 450 && "Développé par Amir Chaal © 2025"}
         {deviceSize.width <= 450 && "Amir Chaal © 2025"}
      </div>
   )
}
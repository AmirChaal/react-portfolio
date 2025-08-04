import type { ComponentType, ElementType, SVGProps } from "react"

export default function ProximityNavigationElement({ Icon, label }: {
   readonly Icon: any,
   readonly label: string
}) {
   return <div className="flex flex-col gap-[0.25em] justify-center items-center bg-black h-[6em] w-[6em] rounded-[1em]">
      {/* <HomeIcon className="h-[2.5em] w-[2.5em]" color="white" /> */}
      <Icon className="h-[2.5em] w-[2.5em]" color="white" />
      <p className="text-[white] select-none font-bold uppercase text-[0.9em]">{label}</p>
   </div>
}
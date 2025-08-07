import { useRef } from "react";
import { useGlobal } from "../stores/global";
import ArrowIcon from "./icons/ArrowIcon";

export default function TextButton({ text, onClick, className = "" }: { text: string, onClick: () => void, className?: string }) {
   const { textColor } = useGlobal()

   const hoveredRef = useRef(false)
   const onMouseEnter = () => hoveredRef.current = true
   const onMouseLeave = () => hoveredRef.current = false

   return (
      <button onClick={onClick} className={"flex gap-[0.3em] items-center cursor-pointer " + className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
         <div>
            {hoveredRef.current && <ArrowIcon className="h-full w-[0.8em]" color={textColor} />}
         </div>
         <p >{text}</p>
      </button>
   )
}
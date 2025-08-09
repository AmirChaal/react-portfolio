import { useRef } from "react";
import { useGlobal } from "../stores/global";
import ArrowIcon from "./icons/ArrowIcon";

export default function TextButton({ text, onClick, className = "" }: { text: string, onClick: () => void, className?: string }) {
   const { textColor } = useGlobal()

   const hoveredRef = useRef(false)
   const onMouseEnter = () => hoveredRef.current = true
   const onMouseLeave = () => hoveredRef.current = false

   let arrowWrapperClasses = 'overflow-hidden transition-all'
   if (hoveredRef.current === true) arrowWrapperClasses += ' w-[0.8em]'
   else arrowWrapperClasses = ' w-[0em]'

   return (
      <button onClick={onClick} className={"flex gap-[0.3em] items-center cursor-pointer " + className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
         <div className={arrowWrapperClasses}>
            {<ArrowIcon className="h-full w-[0.8em]" color={textColor} />}
         </div>
         <p >{text}</p>
      </button>
   )
}
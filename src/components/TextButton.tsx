import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useGlobal } from "../stores/global";
import ArrowIcon from "./icons/ArrowIcon";
import gsap from "gsap";

export default function TextButton({ text, onMouseEnter = () => { }, ...buttonProps }: { text: string, onMouseEnter?: () => void } & ComponentPropsWithoutRef<"button">) {
   const { textColor } = useGlobal();
   const arrowWrapperRef = useRef<HTMLDivElement | null>(null);

   const [hovered, setHovered] = useState(false);
   const mouseEnter = () => {
      onMouseEnter()
      setHovered(true)
   };
   const mouseLeave = () => setHovered(false);

   const showArrowRef = useRef<gsap.core.Tween | null>(null);
   useEffect(() => {
      showArrowRef.current = gsap.to(arrowWrapperRef.current, {
         width: "0.83em",
         duration: 0.85,
         ease: "elastic.out(1,0.4)",
         paused: true,
      });
   }, []);

   const hideArrowRef = useRef<gsap.core.Tween | null>(null);
   useEffect(() => {
      hideArrowRef.current = gsap.to(arrowWrapperRef.current, {
         width: "0em",
         duration: 0.2,
         ease: "power2.out",
         paused: true,
      });
   }, []);

   useEffect(() => {
      if (!hideArrowRef.current || !showArrowRef.current) return;
      if (hovered) {
         hideArrowRef.current.pause();
         showArrowRef.current.restart();
      } else {
         showArrowRef.current.pause();
         hideArrowRef.current.restart();
      }
   }, [hovered]);

   return (
      <button {...buttonProps} className={"flex gap-[0.3em] items-center cursor-pointer " + buttonProps.className} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
         <div ref={arrowWrapperRef} className="overflow-hidden">
            <ArrowIcon className="h-full w-[0.8em]" color={textColor} />
         </div>
         <p>{text}</p>
      </button>
   );
}

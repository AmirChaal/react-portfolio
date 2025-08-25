import React, { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";
import { useGlobal } from "../stores/global";
import ArrowIcon from "./icons/ArrowIcon";
import gsap from "gsap";
import type { IconComponentProps } from "../types/component";

export default function TextButton({ text, onMouseEnter = () => { }, onMouseLeave = () => { }, endIcon = undefined, ...buttonProps }: { text: string, onMouseEnter?: () => void, onMouseLeave?: () => void, endIcon?: ReactElement<IconComponentProps> } & ComponentPropsWithoutRef<"button">) {
   const { textColor } = useGlobal();
   const arrowWrapperRef = useRef<HTMLDivElement | null>(null);

   const [hovered, setHovered] = useState(false);
   const mouseEnter = () => {
      onMouseEnter()
      setHovered(true)
   };
   const mouseLeave = () => {
      onMouseLeave()
      setHovered(false)
   };

   const showArrowRef = useRef<gsap.core.Tween | null>(null);
   useEffect(() => {
      showArrowRef.current = gsap.to(arrowWrapperRef.current, {
         width: "1.13em",
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
      <button {...buttonProps} className={"flex items-center cursor-pointer " + buttonProps.className} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
         <div ref={arrowWrapperRef} className="overflow-hidden">
            <ArrowIcon className="h-full w-[0.8em]" color={textColor} />
         </div>
         <p className="mr-[0.25em]">{text}</p>
         {endIcon && React.cloneElement(endIcon, { className: "h-full w-[0.6em]", color: textColor })}
      </button>
   );
}

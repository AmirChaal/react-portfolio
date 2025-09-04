import { useEffect } from "react";
import { useGlobal } from "../stores/global";

export function useCursorCoordinates() {
   const { update } = useGlobal();

   useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
         update({
            cursorCoordinates: {
               x: event.clientX,
               y: event.clientY,
            }
         });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
      };
   }, []);
}

export function detectInputMethod() {
   const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
   const hasHover = window.matchMedia("(hover: hover)").matches;

   if (hasFinePointer && hasHover) {
      return "cursor"; // Mouse or trackpad
   }

   if (window.matchMedia("(pointer: coarse)").matches) {
      return "touch"; // Touchscreen
   }

   return "unknown"; // TV remotes, VR, etc.
}

export function watchInputMethodChange(callback: (detect: ReturnType<typeof detectInputMethod>) => void) {
   const queries = [
      window.matchMedia("(pointer: fine)"),
      window.matchMedia("(hover: hover)"),
      window.matchMedia("(pointer: coarse)")
   ];

   function update() {
      callback(detectInputMethod());
   }

   // Listen for changes
   queries.forEach(q => {
      if (q.addEventListener) {
         q.addEventListener("change", update);
      } else {
         // Fallback for Safari/older browsers
         q.addListener(update);
      }
   });

   // Run once on init
   update();
}
import { useEffect } from "react";
import { useGlobal } from "../stores/global";

export function useCursorCoordinates() {
   const { update, inputMethod } = useGlobal();

   useEffect(() => {
      if (inputMethod === 'cursor') {
         const handleMouseMove = (event: MouseEvent) => {
            update({
               cursorCoordinates: {
                  x: event.clientX,
                  y: event.clientY,
               },
            });
         };

         window.addEventListener('mousemove', handleMouseMove);

         return () => {
            window.removeEventListener('mousemove', handleMouseMove);
         };
      } else if (inputMethod === 'touch') {
         const updateTouchCoordinates = (x: number, y: number) => {
            update({ cursorCoordinates: { x, y } });
         };

         const handleTouchMove = (event: TouchEvent) => {
            if (event.touches.length > 0) {
               const touch = event.touches[0];
               updateTouchCoordinates(touch.clientX, touch.clientY);
            }
         };

         const handleTouchStart = (event: TouchEvent) => {
            if (event.touches.length > 0) {
               const touch = event.touches[0];
               updateTouchCoordinates(touch.clientX, touch.clientY);
            }
         };

         window.addEventListener('touchmove', handleTouchMove);
         window.addEventListener('touchstart', handleTouchStart);

         return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchStart);
         };
      }
   }, [inputMethod, update]);
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
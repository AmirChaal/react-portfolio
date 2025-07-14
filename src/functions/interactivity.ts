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
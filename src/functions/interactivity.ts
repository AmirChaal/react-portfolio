import { useEffect } from "react";
import { useGlobal } from "../stores/global";

export default function useCursorCoordinates() {
   const { setCursorCoordinates } = useGlobal();

   useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
         setCursorCoordinates({
            x: event.clientX,
            y: event.clientY,
         });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
      };
   }, [setCursorCoordinates]);
}
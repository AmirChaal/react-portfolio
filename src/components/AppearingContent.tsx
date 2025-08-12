import gsap from "gsap";
import { useEffect, useState, type ReactNode } from "react";

export default function AppearingContent({ children, visible, }: { children: ReactNode, visible: boolean }) {
   const [opacity, setOpacity] = useState(visible ? 1 : 0); const [y, setY] = useState(visible ? 0 : 150);
   useEffect(() => {
      gsap.to({ value: opacity }, {
         value: visible ? 1 : 0,
         duration: 0.5,
         ease: visible ? "power4.out" : "power4.in",
         onUpdate: function () {
            setOpacity(this.targets()[0].value);
         },
      });
   }, [visible]);

   useEffect(() => {
      gsap.to({ value: y }, {
         value: visible ? 0 : 150,
         duration: 0.5,
         ease: visible ? "power4.out" : "power4.in",
         onUpdate: function () {
            setY(this.targets()[0].value);
         },
      });
   }, [visible]);

   return (
      <div style={{ opacity, transform: `translateY(-${y}%)` }}>
         {children}
      </div>
   );
}

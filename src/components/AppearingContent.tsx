import gsap from "gsap";
import { useEffect, useState, type ReactNode } from "react";

export default function AppearingContent({ children, visible = false, className = "" }: { children: ReactNode, visible?: boolean, className?: string }) {
   const outY = 3

   const [opacity, setOpacity] = useState(visible ? 1 : 0); const [y, setY] = useState(visible ? 0 : outY);
   useEffect(() => {
      gsap.to({ value: opacity }, {
         value: visible ? 1 : 0,
         duration: 0.25,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () {
            setOpacity(this.targets()[0].value);
         },
      });
   }, [visible]);

   useEffect(() => {
      gsap.to({ value: y }, {
         value: visible ? 0 : outY,
         duration: 0.25,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () {
            setY(this.targets()[0].value);
         },
      });
   }, [visible]);

   return (
      <div className={className} style={{ opacity, transform: `translateY(-${y}em)` }}>
         {children}
      </div>
   );
}

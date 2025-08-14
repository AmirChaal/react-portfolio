import gsap from "gsap";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function AppearingContent({ children, visible = false, className = "" }: { children: ReactNode, visible?: boolean, className?: string }) {
   const outY = 3
   const animationDuration = 0.25

   const [wrapperClasses, setWrapperClasses] = useState('')
   useEffect(() => {
      setWrapperClasses(className)
      if (visible === false) setWrapperClasses(prev => prev + ' pointer-events-none')
   }, [visible, className])

   const [opacity, setOpacity] = useState(visible ? 1 : 0); const [y, setY] = useState(visible ? 0 : outY);
   useEffect(() => {
      gsap.to({ value: opacity }, {
         value: visible ? 1 : 0,
         duration: animationDuration,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () {
            setOpacity(this.targets()[0].value);
         },
      });
   }, [visible]);

   useEffect(() => {
      gsap.to({ value: y }, {
         value: visible ? 0 : outY,
         duration: animationDuration,
         ease: visible ? "power2.out" : "power2.in",
         onUpdate: function () {
            setY(this.targets()[0].value);
         },
      });
   }, [visible]);

   const [effectiveVisibility, setEffectiveVisibility] = useState(visible ? true : false)
   useEffect(() => {
      if (visible === true) {
         setEffectiveVisibility(true)
      } else {
         setTimeout(() => {
            setEffectiveVisibility(false)
         }, animationDuration);
      }
   }, [visible])

   return (
      <div className={wrapperClasses} style={{ opacity, transform: `translateY(-${y}em)` }}>
         {children}
      </div>
   );
}

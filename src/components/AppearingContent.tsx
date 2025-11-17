import gsap from "gsap";
import {
   useEffect,
   useRef,
   type ComponentPropsWithoutRef,
   type ReactNode,
} from "react";

export default function AppearingContent({
   children,
   visible = false,
   ...wrapperProps
}: { children: ReactNode; visible?: boolean } & ComponentPropsWithoutRef<"div">) {
   const ref = useRef<HTMLDivElement>(null);
   const outY = 3; // in em
   const animationDuration = 0.25;

   useEffect(() => {
      if (ref.current == null) return;

      gsap.to(ref.current, {
         opacity: visible ? 1 : 0,
         y: visible ? 0 : `-${outY}em`,
         duration: animationDuration,
         ease: visible ? "power2.out" : "power2.in",
         onStart: () => {
            if (visible && ref.current != null) {
               ref.current.style.pointerEvents = "auto";
            }
         },
         onComplete: () => {
            if (!visible && ref.current != null) {
               ref.current.style.pointerEvents = "none";
            }
         },
      });
   }, [visible]);

   return (
      <div
         ref={ref}
         {...wrapperProps}
         style={{
            ...wrapperProps.style,
            opacity: 0, // start hidden, GSAP animates to 1
            transform: `translateY(-${outY}em)`,
            // willChange: "opacity, transform",
            pointerEvents: "none",
         }}
      >
         {children}
      </div>
   );
}

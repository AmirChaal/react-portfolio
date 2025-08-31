import React, { type ComponentPropsWithoutRef, type ReactNode, useEffect, useState } from "react";

export default function AppearingList({ visible, interval = 75, children, ...wrapperProps }: { visible: boolean; interval?: number; children: ReactNode[]; } & ComponentPropsWithoutRef<'div'>) {
   const [visibilityStates, setVisibilityStates] = useState(
      Array(children.length).fill(false)
   );

   useEffect(() => {
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      const order = visible ? [...children.keys()].reverse() : [...children.keys()];

      order.forEach((i, idx) => {
         const timeoutId = setTimeout(() => {
            setVisibilityStates((prev) => {
               const copy = [...prev];
               copy[i] = visible;
               return copy;
            });
         }, idx * interval);

         timeouts.push(timeoutId);
      });

      return () => {
         timeouts.forEach(clearTimeout);
      };
   }, [visible, children.length, interval]);

   return (
      <>
         <div {...wrapperProps} style={{ pointerEvents: visible ? 'auto' : 'none' }} >
            {children.map((child, idx) => (
               <div key={idx}>
                  {/* @ts-expect-error AppearingContent prop */}
                  {React.cloneElement(child, { visible: visibilityStates[idx] })}
               </div>
            ))}
         </div>
      </>
   );
}

import React, { type ReactNode, useEffect, useState } from "react";

export default function AppearingList({ visible, interval = 75, children }: { visible: boolean; interval?: number; children: ReactNode[]; }) {
   const [visibilityStates, setVisibilityStates] = useState(Array(children.length).fill(false));

   useEffect(() => {
      const order = visible ? [...children.keys()].reverse() : [...children.keys()];

      order.forEach((i, idx) => {
         setTimeout(() => {
            setVisibilityStates((prev) => {
               const copy = [...prev];
               copy[i] = visible;
               return copy;
            });
         }, idx * interval);
      });
   }, [visible, children.length, interval]);

   return (
      <>
         {children.map((child, idx) => (
            <div key={idx}>
               {/* @ts-expect-error AppearingContent prop */}
               {React.cloneElement(child, { visible: visibilityStates[idx] })}
            </div>
         ))}
      </>
   );
}

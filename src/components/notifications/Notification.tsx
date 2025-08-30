import type { ReactElement } from "react";
import type { IconComponentProps } from "../../types/component";
import React from "react";
import { useGlobal } from "../../stores/global";

export default function Notification({ icon, text }: { icon: ReactElement<IconComponentProps>, text: string }) {
   const { textColor, backgroundColor } = useGlobal()

   return (
      <>
         <div className="h-[2.5em] flex justify-center items-center gap-[1em] p-[0.5em] rounded-[0.5em] shadow-[0_0_10px_0_rgba(0,0,0,0.3)]" style={{ background: backgroundColor }}>
            {React.cloneElement(icon, { color: textColor })}
            <p className="text-[1.3em]">{text}</p>
         </div>
      </>
   )
}
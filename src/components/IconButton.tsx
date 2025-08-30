import type { ComponentPropsWithoutRef, ReactElement } from "react";
import type { IconComponentProps } from "../types/component";
import React from "react";
import { useGlobal } from "../stores/global";

export default function IconButton({ iconComponent, ...wrapperProps }: { iconComponent: ReactElement<IconComponentProps> } & ComponentPropsWithoutRef<'div'>) {
   const { backgroundColor, textColor } = useGlobal()

   return (
      <>
         <div {...wrapperProps} className={wrapperProps.className + ` rounded-[100em] h-[4em] w-[4em] flex justify-center items-center cursor-pointer`}>
            {React.cloneElement(iconComponent, { className: "h-[2em]", color: backgroundColor })}
         </div>
      </>
   )
}
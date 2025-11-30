import React, { type ComponentPropsWithoutRef, type ReactElement } from "react";
import { useGlobal } from "../stores/global";
import type { IconComponentProps } from "../types/component";

export default function StaticIconButton({ iconComponent, ...wrapperProps }: { iconComponent: ReactElement<IconComponentProps> } & ComponentPropsWithoutRef<'button'>) {
   const { textColor } = useGlobal()

   return (
      <button {...wrapperProps} className={"font-jersey10 flex items-center gap-[0.4em] cursor-pointer " + wrapperProps.className}>
         {React.cloneElement(iconComponent, { className: "h-[0.9em] " + iconComponent.props.className, color: textColor })}
         <p>Retour</p>
      </button>
   )
}
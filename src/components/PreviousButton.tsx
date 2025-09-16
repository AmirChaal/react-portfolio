import type { ComponentPropsWithoutRef } from "react";
import PixelArrowIcon from "./icons/PixelArrowIcon";
import StaticIconButton from "./StaticIconButton";

export default function PreviousButton(wrapperProps: ComponentPropsWithoutRef<'div'>) {
   return (
      <StaticIconButton {...wrapperProps} iconComponent={<PixelArrowIcon className="rotate-180" />} />
   )
}
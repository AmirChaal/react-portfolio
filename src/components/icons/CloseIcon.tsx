import type { IconComponentProps } from "../../types/component";

export default function CloseIcon({ color = "black", ...wrapperProps }: IconComponentProps) {
   return (
      <div {...wrapperProps}>
         <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
      </div>
   )
}

import type { IconComponentProps } from "../../types/component";

export default function OpenInNewIcon({ color = "#000000", ...wrapperProps }: IconComponentProps) {
   return (
      <div {...wrapperProps}>
         <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill={color} stroke="none">
               <path d="M100 950 l0 -50 -50 0 -50 0 0 -400 0 -400 50 0 50 0 0 -50 0 -50 400 0 400 0 0 50 0 50 50 0 50 0 0 150 0 150 -100 0 -100 0 0 -100 0 -100 -300 0 -300 0 0 300 0 300 100 0 100 0 0 100 0 100 -150 0 -150 0 0 -50z" />
               <path d="M500 900 l0 -100 50 0 50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -50 0 -50 -50 0 -50 0 0 -100 0 -100 100 0 100 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 50 0 50 50 0 50 0 0 -50 0 -50 100 0 100 0 0 250 0 250 -250 0 -250 0 0 -100z" />
            </g>
         </svg>
      </div>
   )
}



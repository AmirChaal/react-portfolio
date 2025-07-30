import { useNavigate } from "react-router"

export default function NavigationBar() {
   const navigate = useNavigate()

   const homeOnClick = () => {
      navigate('/home')
   }

   return (
      <div className="z-10 absolute top-0 left-0 right-0 h-[4em] px-[2em] flex justify-between items-center font-micro5 text-4xl">
         <p onClick={homeOnClick}>Home</p>
         <div className="flex items-center gap-[1em]">
            <p>nightmode</p>
            <p>menu</p>
         </div>
      </div>
   )
}
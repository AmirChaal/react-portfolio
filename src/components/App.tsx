import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useCanvasSize } from "../functions/setup";
import HomeComponent from "./HomeComponent";
import { WebGLBehindCanvas } from "./webGLBehindCanvas/WebGLBehindCanvas";
import WorksComponent from "./worksView/WorksComponent";
import WebGLFloatiesCanvas from "./webGLFloatiesCanvas/WebGLFloatiesCanvas";
function App() {
   const {view} = useParams()

   useCursorCoordinates()
   useCanvasSize()

   const navigate = useNavigate()

   const homeOnClick = () => {
      navigate('/home')
   }

   return <>
      <WebGLFloatiesCanvas />

      <WebGLBehindCanvas />
      
      {/* <div className="z-10 absolute top-0 left-0 right-0 h-[4em] px-[2em] flex justify-between items-center font-micro5 text-4xl">
         <p onClick={homeOnClick}>Home</p>
         <div className="flex items-center gap-[1em]">
            <p>nightmode</p>
            <p>menu</p>
         </div>
      </div>

      {view === 'home' && <HomeComponent />}
      {view === 'works' && <WorksComponent />} */}
   </>;
}

export default App;

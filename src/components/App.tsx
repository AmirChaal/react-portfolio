import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useCanvasSize } from "../functions/setup";
import { useGlobal } from "../stores/global";
import HomeComponent from "./HomeComponent";
import { WebGLBehindCanvas } from "./webGLBehindCanvas/WebGLBehindCanvas";
import WorksComponent from "./worksView/WorksComponent";
function App() {
   const { currentView } = useGlobal()

   useCursorCoordinates()
   useCanvasSize()

   return <>
      <WebGLBehindCanvas />
      
      <div className="absolute top-0 left-0 right-0 h-[4em] px-[2em] flex justify-between items-center font-micro5 text-4xl">
         <p>Home</p>
         <div className="flex items-center gap-[1em]">
            <p>nightmode</p>
            <p>menu</p>
         </div>
      </div>

      {currentView === 'home' && <HomeComponent />}
      {currentView === 'works' && <WorksComponent />}
   </>;
}

export default App;

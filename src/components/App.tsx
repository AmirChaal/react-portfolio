import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useCanvasSize } from "../functions/setup";
import HomeComponent from "./HomeComponent";
import { WebGLBehindCanvas } from "./webGLBehindCanvas/WebGLBehindCanvas";
import WorksComponent from "./worksView/WorksComponent";
import WebGLFloatiesCanvas from "./webGLFloatiesCanvas/WebGLFloatiesCanvas";
import NavigationBar from "./NavigationBar";
import Background from "./Background";
import { useGlobal } from "../stores/global";

function App() {
   const { view } = useParams()

   const { backgroundColor, textColor } = useGlobal()

   const navigate = useNavigate()
   if (!view) {
      navigate('home')
   }

   useCursorCoordinates()
   useCanvasSize()
   // #e9d4ab
   return (
      <div className="absolute h-full w-full " style={{ backgroundColor: backgroundColor, color: textColor }}>
      {/* <div className="absolute h-full w-full bg-[linear-gradient(#EBE1BB_0%,#ece6c2_50%,#ece6c2_50%,#EBE1BB_100%)]" style={{ color: textColor }}> */}
         <WebGLFloatiesCanvas />

         <WebGLBehindCanvas />

         <Background />

         <NavigationBar />

         {view === 'home' && <HomeComponent />}
         {view === 'works' && <WorksComponent />}
      </div>
   )
}

export default App;

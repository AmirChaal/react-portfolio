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
function App() {
   const { view } = useParams()

   useCursorCoordinates()
   useCanvasSize()

   return <>

      <WebGLFloatiesCanvas />

      <WebGLBehindCanvas />

      <Background />
      
      {/* <NavigationBar /> */}

      {/* {view === 'home' && <HomeComponent />}
      {view === 'works' && <WorksComponent />} */}
   </>;
}

export default App;

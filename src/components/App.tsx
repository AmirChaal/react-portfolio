import "../css/App.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useCanvasSize } from "../functions/setup";
import HomeComponent from "./HomeComponent";
import { WebGLBehindCanvas } from "./webGLBehindCanvas/WebGLBehindCanvas";
function App() {
   useCursorCoordinates()
   useCanvasSize()

   return <>
      <WebGLBehindCanvas />
      <HomeComponent />
   </>;
}

export default App;

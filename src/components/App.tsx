import { useEffect } from "react";
import "../css/App.css";
import { useGlobal } from "../stores/global";
import HomeComponent from "./HomeComponent";
import useCursorCoordinates from "../functions/interactivity";

function App() {
   useCursorCoordinates()

   return <HomeComponent />;
}

export default App;

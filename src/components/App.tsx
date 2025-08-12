import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useDeviceSize } from "../functions/setup";
import HomeComponent from "./HomeComponent";
import { WebGLBehindCanvas } from "./webGLBehindCanvas/WebGLBehindCanvas";
import WorksComponent from "./worksView/WorksComponent";
import WebGLFloatiesCanvas from "./webGLFloatiesCanvas/WebGLFloatiesCanvas";
import NavigationBar from "./NavigationBar";
import Background from "./Background";
import { useGlobal } from "../stores/global";
import { useEffect, useMemo, useRef, useState } from "react";
import ApplicationLoading from "./ApplicationLoading";
import Noise from "./Noise";

const bigFloatyPaths = ["/floaties-textures/at.png", "/floaties-textures/and.png", "/floaties-textures/dollar.png", "/floaties-textures/hash.png", "/floaties-textures/less.png"];
const mediumFloatyPaths = ["/floaties-textures/n.png", "/floaties-textures/x.png", "/floaties-textures/e.png", "/floaties-textures/s.png", "/floaties-textures/o.png"];
const smallFloatyPaths = ["/floaties-textures/dot.png", "/floaties-textures/comma.png"];

function App() {
   const { view } = useParams()
   const { textColor } = useGlobal()

   /**
    * Setup
    */
   useCursorCoordinates()
   useDeviceSize()

   /**
    * Routing
    */
   const navigate = useNavigate()
   if (!view) {
      navigate('home')
   }

   /**
    * Load ressources
    */

   // Textures
   const { textureLoader, texturesLoaded, update, textures } = useGlobal()
   const provideTextures = (textureGroup: string, paths: string[]) => {
      const loadedTextures = paths.map(path => textureLoader.load(path))
      textures[textureGroup] = loadedTextures
      update({ textures: textures })
   }
   useEffect(() => {
      provideTextures('bigFloatyTextures', bigFloatyPaths)
      provideTextures('mediumFloatyTextures', mediumFloatyPaths)
      provideTextures('smallFloatyTextures', smallFloatyPaths)
   }, [])

   // Ready application
   const [loadingComplete, setLoadingComplete] = useState(false)
   // useEffect(() => {
   //    if (texturesLoaded === true) {
   //       setLoadingComplete(true)
   //    }
   // }, [texturesLoaded])
   useEffect(() => {
      setTimeout(() => {
         setLoadingComplete(true)
      }, 1000);
   }, [])

   const homeComponentVisible = useMemo(() => {
      return view === 'home' && loadingComplete === true
   }, [loadingComplete, view])

   return (
      <div style={{ color: textColor }}>
         <Background />

         <ApplicationLoading visible={!loadingComplete} />

         {/* <WebGLFloatiesCanvas /> */}
         {/* <WebGLBehindCanvas /> */}

         <div className="absolute h-full w-full" >
            <NavigationBar />
            <HomeComponent visible={homeComponentVisible} />
            {view === 'works' && <WorksComponent />}
         </div>

         <Noise />
      </div>
   )
}

export default App;

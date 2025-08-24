import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { useDeviceSize } from "../functions/setup";
import HomeComponent from "./HomeComponent";
import WorksComponent from "./worksView/WorksComponent";
import WebGLFloatiesCanvas from "./webGLFloatiesCanvas/WebGLFloatiesCanvas";
import NavigationBar from "./NavigationBar";
import Background from "./Background";
import { useGlobal } from "../stores/global";
import { useEffect, useState } from "react";
import ApplicationLoading from "./ApplicationLoading";
import Noise from "./Noise";
import { WebGLBehindCanvasWrapper } from "./webGLBehindCanvas/WebGLBehindCanvasWrapper";
import AboutComponent from "./AboutView/AboutComponent";

export default function App() {
   const { view } = useParams();
   const { textColor, textureLoader, textures, update } = useGlobal();

   useCursorCoordinates();
   useDeviceSize();

   const navigate = useNavigate();
   if (!view) {
      navigate("home");
   }

   const provideTextures = (textureLabel: string, path: string) => {
      const loadedTexture = textureLoader.load(path)
      textures[textureLabel] = loadedTexture;
      update({ textures: textures });
   };

   useEffect(() => {
      provideTextures("floatyAt", "/floaties-textures/at.png");
      provideTextures("floatyAnd", "/floaties-textures/and.png");
      provideTextures("floatyDollar", "/floaties-textures/dollar.png");
      provideTextures("floatyHash", "/floaties-textures/hash.png");
      provideTextures("floatyLess", "/floaties-textures/less.png");
      provideTextures("floatyN", "/floaties-textures/n.png");
      provideTextures("floatyX", "/floaties-textures/x.png");
      provideTextures("floatyE", "/floaties-textures/e.png");
      provideTextures("floatyS", "/floaties-textures/s.png")
      provideTextures("floatyO", "/floaties-textures/o.png")
      provideTextures("floatyDot", "/floaties-textures/dot.png")
      provideTextures("floatyComma", "/floaties-textures/comma.png")
      provideTextures("avyScreenA", "/avy-screen-textures/a.png")
      provideTextures("avyScreenB", "/avy-screen-textures/b.png")
      provideTextures("avyScreenC", "/avy-screen-textures/c.png")
      provideTextures("avyScreenD", "/avy-screen-textures/d.png")
      provideTextures("avyScreenE", "/avy-screen-textures/e.png")
      provideTextures("avyScreenNoise", "/avy-screen-textures/noise.png")
      provideTextures("avyScreenDefault", "/avy-screen-textures/default.png")
      provideTextures("avyCuteOpenEye", "/avy-screen-textures/cute_open_eye.png")
      provideTextures("avyCuteOpenEyeRed", "/avy-screen-textures/cute_open_eye_red.png")
      provideTextures("avyCuteClosedLeftEye", "/avy-screen-textures/cute_closed_left_eye.png")
      provideTextures("avyCuteClosedRightEye", "/avy-screen-textures/cute_closed_right_eye.png")
      provideTextures("avyCuteOpenMouth", "/avy-screen-textures/cute_open_mouth.png")
      provideTextures("avyCuteClosedMouth", "/avy-screen-textures/cute_closed_mouth.png")
   }, []);

   const [loadingComplete, setLoadingComplete] = useState(false);
   useEffect(() => {
      setTimeout(() => {
         setLoadingComplete(true);
      }, 1000);
   }, []);

   // --- Delayed show states for components ---
   const appearanceDelay = 350 // miliseconds
   const [showNavigation, setShowNavigation] = useState(false);
   const [showHome, setShowHome] = useState(false);
   const [showWorks, setShowWorks] = useState(false);
   const [showAbout, setShowAbout] = useState(false);
   const [showFloatiesCanvas, setShowFloatiesCanvas] = useState(false);
   const [focusFloatiesCanvas, setFocusFloatiesCanvas] = useState(false);
   const [showBehindCanvas, setShowBehindCanvas] = useState(false);

   // HOME COMPONENT VISIBILITY
   useEffect(() => {
      if (loadingComplete) {
         const timer = setTimeout(() => setShowNavigation(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowNavigation(false);
      }
   }, [view, loadingComplete]);

   useEffect(() => {
      if (view === "home" && loadingComplete) {
         const timer = setTimeout(() => setShowHome(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowHome(false);
      }
   }, [view, loadingComplete]);

   // WORKS COMPONENT VISIBILITY
   useEffect(() => {
      if (view === "works" && loadingComplete) {
         const timer = setTimeout(() => setShowWorks(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowWorks(false);
      }
   }, [view, loadingComplete]);
   
   // ABOUT COMPONENT VISIBILITY
   useEffect(() => {
      if (view === "about" && loadingComplete) {
         const timer = setTimeout(() => setShowAbout(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowAbout(false);
      }
   }, [view, loadingComplete]);

   // FLOATIES CANVAS VISIBILITY
   useEffect(() => {
      if (loadingComplete) {
         const timer = setTimeout(() => setShowFloatiesCanvas(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowFloatiesCanvas(false);
      }
   }, [view, loadingComplete]);

   // FLOATIES CANVAS FOCUS
   useEffect(() => {
      if (view === "home" && loadingComplete) {
         const timer = setTimeout(() => setFocusFloatiesCanvas(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setFocusFloatiesCanvas(false);
      }
   }, [view, loadingComplete]);

   // BEHIND CANVAS VISIBILITY
   useEffect(() => {
      if (view === "works" && loadingComplete) {
         const timer = setTimeout(() => setShowBehindCanvas(true), appearanceDelay);
         return () => clearTimeout(timer);
      } else {
         setShowBehindCanvas(false);
      }
   }, [view, loadingComplete]);

   return (
      <div className="select-none " style={{ color: textColor }}>
         <Background />
         <ApplicationLoading visible={!loadingComplete} />

         <WebGLFloatiesCanvas visible={showFloatiesCanvas} focused={focusFloatiesCanvas} />
         <WebGLBehindCanvasWrapper visible={showBehindCanvas} />

         <NavigationBar visible={showNavigation} />
         <HomeComponent visible={showHome} />
         <WorksComponent visible={showWorks} />
         <AboutComponent visible={showAbout} />

         <Noise />
      </div>
   );
}

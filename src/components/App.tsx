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

const bigFloatyPaths = ["/floaties-textures/at.png", "/floaties-textures/and.png", "/floaties-textures/dollar.png", "/floaties-textures/hash.png", "/floaties-textures/less.png"];
const mediumFloatyPaths = ["/floaties-textures/n.png", "/floaties-textures/x.png", "/floaties-textures/e.png", "/floaties-textures/s.png", "/floaties-textures/o.png"];
const smallFloatyPaths = ["/floaties-textures/dot.png", "/floaties-textures/comma.png"];
const avyScreenTextures = ["/avy-screen-textures/a.png", "/avy-screen-textures/b.png", "/avy-screen-textures/c.png", "/avy-screen-textures/d.png", "/avy-screen-textures/e.png", "/avy-screen-textures/noise.png"];

export default function App() {
   const { view } = useParams();
   const { textColor, textureLoader, textures, update } = useGlobal();

   useCursorCoordinates();
   useDeviceSize();

   const navigate = useNavigate();
   if (!view) {
      navigate("home");
   }

   const provideTextures = (textureGroup: string, paths: string[]) => {
      const loadedTextures = paths.map(path => textureLoader.load(path));
      textures[textureGroup] = loadedTextures;
      update({ textures: textures });
   };

   useEffect(() => {
      provideTextures("bigFloatyTextures", bigFloatyPaths);
      provideTextures("mediumFloatyTextures", mediumFloatyPaths);
      provideTextures("smallFloatyTextures", smallFloatyPaths);
      provideTextures("avyScreenTextures", avyScreenTextures)
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
      <div className="select-none" style={{ color: textColor }}>
         <Background />
         <ApplicationLoading visible={!loadingComplete} />

         <WebGLFloatiesCanvas visible={showFloatiesCanvas} focused={focusFloatiesCanvas} />
         <WebGLBehindCanvasWrapper visible={showBehindCanvas} />

         <NavigationBar visible={showNavigation} />
         <HomeComponent visible={showHome} />
         <WorksComponent visible={showWorks} />

         <Noise />
      </div>
   );
}

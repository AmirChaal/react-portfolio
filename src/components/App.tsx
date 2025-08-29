import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import { useCursorCoordinates } from "../functions/interactivity";
import { loadTextures, useDeviceSize } from "../functions/setup";
import HomeComponent from "./homeView/HomeComponent";
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
import Article from "./Article/Article";
import Illustrations from "./Illustrations/Illustrations";
import IllustrationViewer from "./Illustrations/IllustrationViewer";

function useDelayedVisibility(condition: boolean, delay: number, deps: any[]) {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      if (condition) {
         const timer = setTimeout(() => setVisible(true), delay);
         return () => clearTimeout(timer);
      } else {
         setVisible(false);
      }
   }, [condition, delay, ...deps]);

   return visible;
}

export default function App() {
   const { firstParticle, secondParticle, thirdParticle } = useParams();
   const { textColor } = useGlobal();

   useCursorCoordinates();
   useDeviceSize();
   loadTextures(useGlobal());

   const navigate = useNavigate();
   if (!firstParticle) {
      navigate("home");
   }

   const [loadingComplete, setLoadingComplete] = useState(false);
   useEffect(() => {
      const timer = setTimeout(() => setLoadingComplete(true), 1000);
      return () => clearTimeout(timer);
   }, []);

   const appearanceDelay = 350;
   const dependencies = [firstParticle, secondParticle, thirdParticle]
   const showNavigation = useDelayedVisibility(loadingComplete, appearanceDelay, dependencies);
   const showHome = useDelayedVisibility(firstParticle === "home" && loadingComplete, appearanceDelay, dependencies);
   const showWorks = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete, appearanceDelay, dependencies);
   const showAbout = useDelayedVisibility(firstParticle === "about" && loadingComplete, appearanceDelay, dependencies);
   const showFloatiesCanvas = useDelayedVisibility(loadingComplete, appearanceDelay, dependencies);
   const focusFloatiesCanvas = useDelayedVisibility(firstParticle === "home" && loadingComplete, appearanceDelay, dependencies);
   const showBehindCanvas = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete, appearanceDelay, dependencies);
   const showWorkPortfolio = useDelayedVisibility(firstParticle === "works" && secondParticle === "portfolio" && loadingComplete, appearanceDelay, dependencies);
   const showIllustrations = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && loadingComplete, appearanceDelay, dependencies);
   const showIllustrationViewer = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && thirdParticle != null && !isNaN(parseInt(thirdParticle)) && loadingComplete, appearanceDelay, dependencies);

   return (
      <div className="select-none" style={{ color: textColor }}>
         <Background />
         <ApplicationLoading visible={!loadingComplete} />
         <NavigationBar visible={showNavigation} />
         <Noise />

         {/* Canvases */}
         <WebGLFloatiesCanvas visible={showFloatiesCanvas} focused={focusFloatiesCanvas} />
         <WebGLBehindCanvasWrapper visible={showBehindCanvas} />

         {/* View */}
         <HomeComponent visible={showHome} />
         <WorksComponent visible={showWorks} />
         <AboutComponent visible={showAbout} />

         {/* Work articles */}
         <Article visible={showWorkPortfolio} />

         {/* Illustrations */}
         <Illustrations visible={showIllustrations} />
         <IllustrationViewer visible={showIllustrationViewer} />
      </div>
   );
}

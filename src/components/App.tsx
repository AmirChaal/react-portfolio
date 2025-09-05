import { useNavigate, useParams } from "react-router";
import "../css/fonts.css";
import "../css/utilities.css";
import { useCursorCoordinates, watchInputMethodChange } from "../functions/interactivity";
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
import Notifications from "./notifications/Notifications";
import getWorksData from "../functions/works";

export const appViewAppearanceDelay = 350;

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
   const { textColor, update, textures } = useGlobal();
   const navigate = useNavigate()
   const worksData = getWorksData(navigate, textures)

   useCursorCoordinates();
   useDeviceSize();
   loadTextures(useGlobal());
   useEffect(() => {
      watchInputMethodChange((inputMethod) => update({ inputMethod: inputMethod }))
   }, [])

   if (!firstParticle) {
      navigate("home");
   }

   const [loadingComplete, setLoadingComplete] = useState(false);
   useEffect(() => {
      const timer = setTimeout(() => setLoadingComplete(true), 1000);
      return () => clearTimeout(timer);
   }, []);

   const dependencies = [firstParticle, secondParticle, thirdParticle]
   const showNavigation = useDelayedVisibility(loadingComplete, appViewAppearanceDelay, dependencies);
   const showHome = useDelayedVisibility(firstParticle === "home" && loadingComplete, appViewAppearanceDelay, dependencies);
   const showWorks = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete, appViewAppearanceDelay, dependencies);
   const showAbout = useDelayedVisibility(firstParticle === "about" && loadingComplete, appViewAppearanceDelay, dependencies);
   const showFloatiesCanvas = useDelayedVisibility(loadingComplete, appViewAppearanceDelay, dependencies);
   const focusFloatiesCanvas = useDelayedVisibility(firstParticle === "home" && loadingComplete, appViewAppearanceDelay, dependencies);
   const showBehindCanvas = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete, appViewAppearanceDelay, dependencies);
   const showIllustrations = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && loadingComplete, appViewAppearanceDelay, dependencies);
   const showIllustrationViewer = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && thirdParticle != null && !isNaN(parseInt(thirdParticle)) && loadingComplete, appViewAppearanceDelay, dependencies);
   const showPortfolioWork = useDelayedVisibility(firstParticle === "works" && secondParticle === "portfolio" && loadingComplete, appViewAppearanceDelay, dependencies);
   const showTTRPGAssistWork = useDelayedVisibility(firstParticle === "works" && secondParticle === "ttrpg-assist" && loadingComplete, appViewAppearanceDelay, dependencies);

   return (
      <div className="select-none overflow-hidden" style={{ color: textColor }}>
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
         {worksData.filter(work => work.article).map(work => {
            const showWork = work.urlCode === "portfolio" ? showPortfolioWork : work.urlCode === "ttrpg-assist" ? showTTRPGAssistWork : false;
            return <Article key={work.id} visible={showWork} title={work.title} description={work.description} buttonClick={work.articleClick} />
         })}

         {/* Illustrations */}
         <Illustrations visible={showIllustrations} />
         <IllustrationViewer visible={showIllustrationViewer} />

         {/* Notifications */}
         <Notifications />
      </div>
   );
}

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
import { useEffect, useRef, useState } from "react";
import ApplicationLoading from "./ApplicationLoading";
import Noise from "./Noise";
import { WebGLBehindCanvasWrapper } from "./webGLBehindCanvas/WebGLBehindCanvasWrapper";
import AboutComponent from "./AboutView/AboutComponent";
import Article from "./Article/Article";
import Illustrations from "./Illustrations/Illustrations";
import IllustrationViewer from "./Illustrations/IllustrationViewer";
import Notifications from "./notifications/Notifications";
import getWorksData from "../functions/works";
import { usePersistentGlobal } from "../stores/persistentGlobal";
import ExtraControls from "./ExtraControls";
import gsap from "gsap";
import EnterApplication from "./EnterApplication";
import { getIllustrationsData } from "../functions/illustrations";
import Copyright from "./Copyright";

export const appViewAppearanceDelay = 350;

function useDelayedVisibility(condition: boolean, delay: number, deps: any[], immediate: boolean = false) {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      if (condition) {
         if (!immediate) {
            const timer = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(timer);
         } else {
            setVisible(true)
         }
      } else {
         setVisible(false);
      }
   }, [condition, delay, ...deps]);

   return visible;
}

export default function App() {
   const { firstParticle, secondParticle, thirdParticle } = useParams();
   const { textColor, update, textures, texturesLoaded, modelsLoaded, floatiesCanvasFirstFrameGenerated, behindCanvasFirstFrameGenerated, enteredApplication } = useGlobal();
   const { playMusic } = usePersistentGlobal()
   const navigate = useNavigate()
   const worksData = getWorksData(navigate, textures)

   useCursorCoordinates();
   useDeviceSize();
   loadTextures(useGlobal());
   useEffect(() => {
      watchInputMethodChange((inputMethod) => update({ inputMethod: inputMethod }))
   }, [])

   useEffect(() => {
      const validFirstParticles = ["home", "works", "about"];
      const validSecondParticles: Record<string, string[]> = {
         works: ["illustrations", "portfolio", "ttrpg-assist"],
      };

      const firstValid = validFirstParticles.includes(firstParticle ?? "");

      // validate second particle
      const secondValid = firstValid && secondParticle
         ? (validSecondParticles[firstParticle ?? ""] || []).includes(secondParticle)
         : true;

      // validate third particle only if we're in /works/illustrations/:id
      let thirdValid = true;
      if (firstParticle === "works" && secondParticle === "illustrations" && thirdParticle != null) {
         const illustrations = getIllustrationsData();
         const parsedId = parseInt(thirdParticle, 10);
         thirdValid = !isNaN(parsedId) && illustrations.some(ill => ill.id === parsedId);
      }

      if (!firstValid || !secondValid || !thirdValid) {
         navigate("/home", { replace: true });
      }
   }, [firstParticle, secondParticle, thirdParticle, navigate]);

   const [loadingComplete, setLoadingComplete] = useState(false);
   useEffect(() => {
      if (texturesLoaded && modelsLoaded && floatiesCanvasFirstFrameGenerated && behindCanvasFirstFrameGenerated) setLoadingComplete(true)
   }, [texturesLoaded, modelsLoaded, floatiesCanvasFirstFrameGenerated, behindCanvasFirstFrameGenerated]);

   const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
   useEffect(() => {
      if (enteredApplication) {
         backgroundMusicRef.current = new Audio('/audio/lofi_music.mp3')
         backgroundMusicRef.current.loop = true
         backgroundMusicRef.current.volume = 0
         backgroundMusicRef.current.play().catch(err => {
            const playOnClick = () => {
               if (backgroundMusicRef.current == null) return
               backgroundMusicRef.current.play();
               window.removeEventListener("click", playOnClick);
            };
            window.addEventListener("click", playOnClick);
         });
      }
   }, [enteredApplication]);
   useEffect(() => {
      if (backgroundMusicRef.current == null) return
      gsap.to(backgroundMusicRef.current, {
         volume: playMusic ? 0.15 : 0,
         duration: 0.5, // fade time in seconds
         ease: "power2.out"
      });
   }, [playMusic, backgroundMusicRef.current])

   const dependencies = [loadingComplete, firstParticle, secondParticle, thirdParticle]
   const showLoading = useDelayedVisibility(!loadingComplete && !enteredApplication, appViewAppearanceDelay, dependencies, true);
   const showEnterScreen = useDelayedVisibility(loadingComplete && !enteredApplication, appViewAppearanceDelay, dependencies);
   const showNavigation = useDelayedVisibility(loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showExtraControls = useDelayedVisibility(loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showHome = useDelayedVisibility(firstParticle === "home" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showWorks = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showAbout = useDelayedVisibility(firstParticle === "about" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showFloatiesCanvas = useDelayedVisibility(loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const focusFloatiesCanvas = useDelayedVisibility(firstParticle === "home" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showBehindCanvas = useDelayedVisibility(firstParticle === "works" && !secondParticle && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showIllustrations = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showIllustrationViewer = useDelayedVisibility(firstParticle === "works" && secondParticle === "illustrations" && thirdParticle != null && !isNaN(parseInt(thirdParticle)) && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showPortfolioWork = useDelayedVisibility(firstParticle === "works" && secondParticle === "portfolio" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);
   const showTTRPGAssistWork = useDelayedVisibility(firstParticle === "works" && secondParticle === "ttrpg-assist" && loadingComplete && enteredApplication, appViewAppearanceDelay, dependencies);

   return (
      <div className="select-none overflow-hidden" style={{ color: textColor }}>
         <Background />
         <ApplicationLoading visible={showLoading} />
         <EnterApplication visible={showEnterScreen} />
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

         {/* Extra controls */}
         <ExtraControls visible={showExtraControls} />

         {/* Copyright */}
         <Copyright />
      </div>
   );
}

import { useGlobal } from "../stores/global";
import { usePersistentGlobal } from "../stores/persistentGlobal";
import AppearingContent from "./AppearingContent";
import MusicNote from "./icons/musicNote";
import MusicNoteOff from "./icons/musicNoteOff";
import NoSoundIcon from "./icons/NoSoundIcon";
import SoundIcon from "./icons/SoundIcon";

export default function ExtraControls({ visible }: { visible: boolean }) {
   const { textColor } = useGlobal()
   const { playSoundEffects, playMusic, updatePersistent } = usePersistentGlobal()

   const musicButtonClick = () => updatePersistent({ playMusic: !playMusic })
   const soundEffectsButtonClick = () => updatePersistent({ playSoundEffects: !playSoundEffects })

   return (
      <div className="absolute h-full w-full top-0 left-0 pointer-events-none">
         <AppearingContent className="absolute right-0 bottom-0 flex gap-[0] min-[1000px]:gap-[1em] p-[0.5em] min-[1000px]:p-[2em]" visible={visible} >
            <button className="cursor-pointer p-[0.5em] h-[3em] w-[3em]" onClick={soundEffectsButtonClick}>
               {playSoundEffects && <SoundIcon className="h-full" color={textColor} />}
               {!playSoundEffects && <NoSoundIcon className="h-full" color={textColor} />}
            </button>
            <button className="cursor-pointer p-[0.5em] h-[3em] w-[3em]" onClick={musicButtonClick}>
               {playMusic && <MusicNote className="h-full" color={textColor} />}
               {!playMusic && <MusicNoteOff className="h-full" color={textColor} />}
            </button>
         </AppearingContent>
      </div>
   )
}
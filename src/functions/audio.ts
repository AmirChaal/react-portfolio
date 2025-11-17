export function playAudio(path: string, volume: number = 0.5) {
   const audio = new Audio(path);
   audio.volume = volume
   audio.play();
   return audio
}

export class AudioPlayer {
   private audioContext: AudioContext;
   private lastPlayTimes: number[] = [];
   private maxPlaysPerSecond: number;
   private bufferCache: Map<string, AudioBuffer>; // cache for decoded buffers

   constructor(maxPlaysPerSecond = 20) {
      this.audioContext = new AudioContext();
      this.maxPlaysPerSecond = maxPlaysPerSecond;
      this.bufferCache = new Map();
   }

   private async loadBuffer(filePath: string): Promise<AudioBuffer> {
      if (this.bufferCache.has(filePath)) {
         return this.bufferCache.get(filePath)!;
      }

      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.bufferCache.set(filePath, audioBuffer);
      return audioBuffer;
   }

   async playSound(
      filePath: string,
      volumeRange: [number, number] = [0.5, 1],
      octaveRange: [number, number] = [1, 2]
   ) {
      const now = performance.now();

      // Remove old timestamps
      this.lastPlayTimes = this.lastPlayTimes.filter(
         (time) => now - time < 1000
      );

      if (this.lastPlayTimes.length >= this.maxPlaysPerSecond) {
         return; // too many plays in the last second
      }

      this.lastPlayTimes.push(now);

      // Load buffer (from cache if available)
      const audioBuffer = await this.loadBuffer(filePath);

      // Create source node (each playback needs its own source)
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Random volume
      const gainNode = this.audioContext.createGain();
      const volume =
         Math.random() * (volumeRange[1] - volumeRange[0]) + volumeRange[0];
      gainNode.gain.value = volume;

      // Random pitch (octave)
      const octave =
         Math.random() * (octaveRange[1] - octaveRange[0]) + octaveRange[0];
      source.playbackRate.value = octave;

      // Connect nodes and play
      source.connect(gainNode).connect(this.audioContext.destination);
      source.start();
   }
}

export function createAutoplayAudio(
   src: string,
   { loop = true, startingVolume = 1 }: { loop?: boolean, startingVolume?: number } = {}
) {
   const audio = new Audio(src);
   audio.loop = loop;
   audio.volume = startingVolume;

   // Try to autoplay silently
   audio.play().catch(() => {
      // Browser blocked autoplay: wait for a user gesture
      const playOnClick = () => {
         audio.play().finally(() => {
            window.removeEventListener("click", playOnClick);
         });
      };
      window.addEventListener("click", playOnClick);
   });

   return {
      audio: audio,
      cleanup: () => {
         audio.pause();
         audio.src = "";
      }
   };
}

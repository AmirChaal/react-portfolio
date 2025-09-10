export function playAudio(path: string) {
   const audio = new Audio(path);
   audio.volume = 0.5
   audio.play();
}

export class AudioPlayer {
   private audioContext: AudioContext;
   private lastPlayTimes: number[] = [];
   private maxPlaysPerSecond: number;

   constructor(maxPlaysPerSecond = 20) {
      this.audioContext = new AudioContext();
      this.maxPlaysPerSecond = maxPlaysPerSecond;
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
         // Too many plays in the last second
         return;
      }

      this.lastPlayTimes.push(now);

      // Fetch and decode the audio
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      // Create a source node
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
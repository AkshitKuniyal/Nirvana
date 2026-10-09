// Nirvana Calming Ambient Sound Synthesizer via Web Audio API
// Generates rain, ocean waves, wind, and singing bowl purely in real-time

type SoundType = "rain" | "waves" | "wind" | "bowl" | "off";

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentSound: SoundType = "off";
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.ctx.currentTime,
        0.05,
      );
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): SoundType {
    return this.currentSound;
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      try {
        if (typeof node === "number") {
          clearInterval(node);
        } else if (
          "stop" in node &&
          typeof (node as AudioScheduledSourceNode).stop === "function"
        ) {
          (node as AudioScheduledSourceNode).stop();
          node.disconnect();
        } else if ("disconnect" in node) {
          node.disconnect();
        }
      } catch {
        // node already stopped or disconnected
      }
    });
    this.activeNodes = [];
    this.currentSound = "off";
  }

  public play(type: SoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentSound = type;

    if (type === "rain") {
      this.playRain();
    } else if (type === "waves") {
      this.playWaves();
    } else if (type === "wind") {
      this.playWind();
    } else if (type === "bowl") {
      this.playSingingBowl();
    }
  }

  // Brown / Pink noise generator
  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.ctx!.sampleRate * 2;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Highpass filter for raindrop hiss
    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(600, this.ctx.currentTime);

    // Lowpass filter to soften
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(4500, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noiseSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, highpass, lowpass, rainGain);
  }

  private playWaves() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    // Periodic surge for gentle ocean swells (approx 8-second waves)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, waveGain);
  }

  private playWind() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, windGain);
  }

  private playSingingBowl() {
    if (!this.ctx || !this.masterGain) return;
    // Harmonic frequencies for Tibetan Singing Bowl (fundamental 216Hz, harmonics ~590Hz, ~1180Hz)
    const baseFreq = 216;
    const strike = () => {
      if (!this.ctx || !this.masterGain || this.currentSound !== "bowl") return;

      const freqs = [baseFreq, baseFreq * 2.76, baseFreq * 5.4];
      const gains = [0.4, 0.15, 0.05];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        oscGain.gain.setValueAtTime(gains[idx], this.ctx!.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx!.currentTime + 6.5,
        );

        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 6.5);
      });
    };

    strike();
    // Re-strike softly every 7 seconds
    const interval = window.setInterval(strike, 7000);
    this.activeNodes.push(interval);
  }
}

export const ambientAudio = new AmbientSoundEngine();

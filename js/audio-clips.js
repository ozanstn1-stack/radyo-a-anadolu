/**
 * Radyo A Web Audio Ses Efektleri ve Sentezleyici
 * FM Analog Radyo Paraziti (Static Noise), İstasyon Kilitlenme Çanı (Jingle),
 * Akustik Stüdyo Beep ve Canlı Synthesizer Fonksiyonları
 */

class StudioSoundEngine {
  constructor() {
    this.ctx = null;
    this.staticNode = null;
    this.staticGain = null;
    this.isPlayingStatic = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * FM Frekans arama beyaz gürültüsü (Radio static noise)
   */
  startRadioStatic(intensity = 0.3) {
    this.init();
    if (this.isPlayingStatic) {
      if (this.staticGain) {
        this.staticGain.gain.setValueAtTime(intensity, this.ctx.currentTime);
      }
      return;
    }

    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.staticNode = this.ctx.createBufferSource();
      this.staticNode.buffer = noiseBuffer;
      this.staticNode.loop = true;

      // Bandpass filtresi (analog radyo hissi için)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      this.staticGain = this.ctx.createGain();
      this.staticGain.gain.setValueAtTime(intensity, this.ctx.currentTime);

      this.staticNode.connect(filter);
      filter.connect(this.staticGain);
      this.staticGain.connect(this.ctx.destination);

      this.staticNode.start();
      this.isPlayingStatic = true;
    } catch (e) {
      console.warn("Static noise audio failed:", e);
    }
  }

  updateStaticIntensity(intensity) {
    if (this.staticGain && this.ctx) {
      this.staticGain.gain.setValueAtTime(Math.max(0, Math.min(0.5, intensity)), this.ctx.currentTime);
    }
  }

  stopRadioStatic() {
    if (this.isPlayingStatic && this.staticNode) {
      try {
        if (this.staticGain) {
          this.staticGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
          setTimeout(() => {
            if (this.staticNode) {
              this.staticNode.stop();
              this.staticNode.disconnect();
              this.staticNode = null;
            }
            this.isPlayingStatic = false;
          }, 100);
        } else {
          this.staticNode.stop();
          this.staticNode.disconnect();
          this.staticNode = null;
          this.isPlayingStatic = false;
        }
      } catch (e) {
        this.isPlayingStatic = false;
      }
    }
  }

  /**
   * Frekans kilitleme klik sesi
   */
  playTunerClick() {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  /**
   * Radyo A İstasyon Jingle Sesi ("Dın-Dın-Dın! Radyo A 100.5 FM")
   */
  playStationJingle() {
    this.init();
    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 (A Majör Akoru - Radyo 'A')
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    } catch (e) {
      console.warn("Jingle error:", e);
    }
  }

  /**
   * Stüdyo 'ON AIR' Mikser Düğmesi bip sesi
   */
  playOnAirBeep() {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch (e) {}
  }
}

export const soundEngine = new StudioSoundEngine();

/**
 * Radyo A Canlı Ses Oynatıcısı (Audio Engine)
 * Canlı Icecast yayını, Stüdyo Akışı, Podcastler ve Web Audio entegrasyonu
 */

import { soundEngine } from './audio-clips.js';

export const STREAM_SOURCES = [
  {
    id: "live-university",
    name: "Radyo A Canlı Yayın (100.5 FM)",
    badge: "Canlı Stüdyo",
    url: "http://canli.radyoa.anadolu.edu.tr:44445/Radyo_A_MP3",
    type: "live",
    description: "Anadolu Üniversitesi Yunus Emre Kampüsü ana stüdyolarından doğrudan canlı akış."
  },
  {
    id: "studio-curated",
    name: "Radyo A Kampüs Seçkisi & Alternatif",
    badge: "Stüdyo Akışı",
    url: "https://stream.zeno.fm/f3wvbbqmdg8uv", // Yüksek kaliteli kesintisiz alternatif/indie radyo akışı
    type: "curated",
    description: "Radyo A müzik direktörleri tarafından hazırlanan Anadolu Rock & Alternatif seçkisi."
  },
  {
    id: "studio-jazz",
    name: "Radyo A Gece & Caz Kuşağı",
    badge: "Gece Kuşağı",
    url: "https://stream.zeno.fm/0r0xa792kwzuv", // Caz & Blues akışı
    type: "jazz",
    description: "Porsuk kıyısında geceye eşlik eden dingin caz ve blues standartları."
  }
];

export class RadioPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "none";
    // HTTPS ortamında (örn. GitHub Pages / Vercel), HTTP karma içerik engeline takılmamak için HTTPS stüdyo akışını önceliklendir
    const isHttps = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';
    this.currentSource = isHttps ? STREAM_SOURCES[1] : STREAM_SOURCES[0];
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.85;
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.hasCorsBlock = false;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnect = 2;

    this.setupAudioEvents();
  }

  setupAudioEvents() {
    this.audio.addEventListener('playing', () => {
      this.isPlaying = true;
      this.emit('statechange', { isPlaying: true, status: 'playing', source: this.currentSource });
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.emit('statechange', { isPlaying: false, status: 'paused', source: this.currentSource });
    });

    this.audio.addEventListener('waiting', () => {
      this.emit('buffering', { isBuffering: true, message: 'Yayın yükleniyor...' });
    });

    this.audio.addEventListener('canplay', () => {
      this.emit('buffering', { isBuffering: false });
    });

    this.audio.addEventListener('error', (e) => {
      console.warn("Radyo akış bağlantı hatası:", e);
      this.handleStreamError();
    });
  }

  initWebAudio() {
    if (this.audioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      // HTML5 Audio elementini bağlama
      try {
        this.audio.crossOrigin = "anonymous";
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      } catch (err) {
        console.warn("CORS kısıtı nedeniyle doğrudan MediaElementSource atlandı, simüle spektrum devrede:", err);
        this.hasCorsBlock = true;
      }
    } catch (e) {
      console.warn("Web Audio API başlatılamadı:", e);
    }
  }

  handleStreamError() {
    this.isPlaying = false;
    if (this.currentSource.id === "live-university" && this.reconnectAttempts < this.maxReconnect) {
      this.reconnectAttempts++;
      this.emit('status', {
        type: 'warning',
        message: `Üniversite sunucusuna bağlanılıyor (Deneme ${this.reconnectAttempts})...`
      });
      setTimeout(() => {
        this.play();
      }, 1500);
    } else if (this.currentSource.id === "live-university") {
      // Üniversite sunucusu kapalıysa ya da tarayıcı karma içerik (mixed-content) engelliyorsa
      this.emit('status', {
        type: 'fallback',
        message: 'Üniversite canlı yayın portuna erişilemedi, kesintisiz Stüdyo Yayınına geçildi.'
      });
      // Yedek stüdyo yayınına otomatik geçiş
      this.switchSource(STREAM_SOURCES[1], true);
    } else {
      this.emit('status', {
        type: 'error',
        message: 'Yayın akışı geçici olarak durduruldu.'
      });
      this.emit('statechange', { isPlaying: false, status: 'error' });
    }
  }

  async play() {
    soundEngine.init();
    if (!this.audioContext) {
      this.initWebAudio();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (!this.audio.src || this.audio.src !== this.currentSource.url) {
      this.audio.src = this.currentSource.url;
    }

    this.audio.volume = this.isMuted ? 0 : this.volume;

    soundEngine.playOnAirBeep();

    this.emit('buffering', { isBuffering: true, message: `${this.currentSource.name} bağlanıyor...` });

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.emit('statechange', { isPlaying: true, status: 'playing', source: this.currentSource });
    } catch (error) {
      console.warn("Play() rejected:", error);
      // Kullanıcı etkileşimi bekleniyor veya ağ engeli
      this.handleStreamError();
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.emit('statechange', { isPlaying: false, status: 'paused', source: this.currentSource });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (!this.isMuted) {
      this.audio.volume = this.volume;
    }
    this.emit('volumechange', { volume: this.volume, isMuted: this.isMuted });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.emit('volumechange', { volume: this.volume, isMuted: this.isMuted });
    return this.isMuted;
  }

  switchSource(source, autoPlay = true) {
    const wasPlaying = this.isPlaying;
    this.currentSource = source;
    this.audio.pause();
    this.audio.src = source.url;
    this.audio.load();
    this.reconnectAttempts = 0;

    this.emit('sourcechange', { source: this.currentSource });

    if (wasPlaying || autoPlay) {
      this.play();
    }
  }

  playEpisode(episodeUrl, title) {
    this.currentSource = {
      id: "podcast-" + Date.now(),
      name: title,
      badge: "Podcast",
      url: episodeUrl,
      type: "podcast",
      description: "Radyo A Arşiv Kaydı"
    };
    this.switchSource(this.currentSource, true);
  }

  /**
   * Spektrum Görselleştirici için frekans verilerini okur
   */
  getFrequencyData() {
    if (this.analyser && !this.hasCorsBlock && this.isPlaying) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return null;
  }

  // Olay dinleyici sistemi
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const radioPlayer = new RadioPlayer();

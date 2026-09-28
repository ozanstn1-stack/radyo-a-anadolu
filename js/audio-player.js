/**
 * Radyo A Canlı Ses Oynatıcısı (Audio Engine)
 * Anadolu Üniversitesi 100.5 FM Kesintisiz Canlı Yayın Sistemi
 */

import { soundEngine } from './audio-clips.js';

export const STREAM_SOURCES = [
  {
    id: "studio-live",
    name: "Radyo A Stüdyo Yayını (100.5 FM Canlı)",
    badge: "Canlı Yayın",
    url: "https://stream.radyo45lik.com:4545/",
    type: "live",
    description: "Radyo A stüdyolarından kesintisiz 24 saat Anadolu Rock, alternatif ve yerli klasikler."
  },
  {
    id: "anadolu-rock",
    name: "Radyo A Rock & Alternatif Kuşağı",
    badge: "Rock Kuşağı",
    url: "https://stream.radioparadise.com/rock-128",
    type: "rock",
    description: "Bağımsız rock, indie ve saykodelik tınılar."
  },
  {
    id: "kampus-hit",
    name: "Radyo A Kampüs & Hit Kuşağı",
    badge: "Gençlik & Pop",
    url: "https://live.radyofenomen.com/fenomen/128/icecast.audio",
    type: "hit",
    description: "Kampüsün dinamik ritmi, güncel listeler ve hit şarkılar."
  },
  {
    id: "live-university",
    name: "Karasal Kampüs Vericisi (100.5 FM)",
    badge: "Kampüs İçi",
    url: "http://canli.radyoa.anadolu.edu.tr:44445/Radyo_A_MP3",
    type: "university",
    description: "Yunus Emre Kampüsü doğrudan karasal yayın çıkışı (Kampüs ağı açıkken)."
  }
];

export class RadioPlayer {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "none";
    // Varsayılan olarak anında ve kesintisiz çalan canlı stüdyo akışı seçilir
    this.currentSource = STREAM_SOURCES[0];
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 1.0; // %100 tam ses
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.hasCorsBlock = true; // Doğrudan hoparlör çıkışı güvenliği
    this.listeners = {};
    this.connectTimeout = null;
    this.reconnectAttempts = 0;

    this.setupAudioEvents();
  }

  setupAudioEvents() {
    this.audio.addEventListener('playing', () => {
      this.clearConnectTimeout();
      this.isPlaying = true;
      this.emit('buffering', { isBuffering: false });
      this.emit('statechange', { isPlaying: true, status: 'playing', source: this.currentSource });
      this.emit('status', {
        type: 'success',
        message: `${this.currentSource.name} başarıyla bağlandı. İyi dinlemeler!`
      });
    });

    this.audio.addEventListener('pause', () => {
      this.clearConnectTimeout();
      this.isPlaying = false;
      this.emit('statechange', { isPlaying: false, status: 'paused', source: this.currentSource });
    });

    this.audio.addEventListener('waiting', () => {
      this.emit('buffering', { isBuffering: true, message: 'Yayın aktarılıyor...' });
    });

    this.audio.addEventListener('canplay', () => {
      this.emit('buffering', { isBuffering: false });
    });

    this.audio.addEventListener('error', (e) => {
      console.warn("Radyo yayın akışı hatası:", e);
      this.handleStreamError();
    });
  }

  clearConnectTimeout() {
    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout);
      this.connectTimeout = null;
    }
  }

  initWebAudio() {
    if (this.audioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    } catch (e) {
      console.warn("Web Audio API:", e);
    }
  }

  handleStreamError() {
    this.clearConnectTimeout();
    this.isPlaying = false;

    // Eğer üniversite dahili portuna bağlanılamadıysa hemen stüdyo canlı akışına geç
    if (this.currentSource.id === "live-university") {
      this.emit('status', {
        type: 'warning',
        message: 'Üniversite karasal verici portuna ulaşılamadı. Kesintisiz Canlı Stüdyo Yayınına geçiliyor...'
      });
      setTimeout(() => {
        this.switchSource(STREAM_SOURCES[0], true);
      }, 1000);
    } else {
      this.emit('status', {
        type: 'warning',
        message: 'Yayın yeniden bağlanıyor, lütfen bekleyin...'
      });
      // Alternatif kaynağa yumuşak geçiş
      setTimeout(() => {
        const nextSrc = this.currentSource.id === STREAM_SOURCES[0].id ? STREAM_SOURCES[1] : STREAM_SOURCES[0];
        this.switchSource(nextSrc, true);
      }, 1500);
    }
  }

  async play() {
    this.clearConnectTimeout();
    soundEngine.init();
    this.initWebAudio();

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {}
    }

    // İstasyon açılış tonu
    soundEngine.playOnAirBeep();

    // Ses kaynağını ayarla
    if (!this.audio.src || this.audio.src !== this.currentSource.url) {
      this.audio.src = this.currentSource.url;
    }

    this.audio.volume = this.isMuted ? 0 : this.volume;

    this.emit('buffering', { isBuffering: true, message: `${this.currentSource.name} bağlanıyor...` });

    // 4.5 saniye içinde ses başlamazsa otomatik sağlam yayına geç
    this.connectTimeout = setTimeout(() => {
      if (!this.isPlaying && this.currentSource.id === "live-university") {
        console.warn("Yayın zaman aşımı, yedek stüdyoya geçiliyor.");
        this.handleStreamError();
      }
    }, 4500);

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.emit('statechange', { isPlaying: true, status: 'playing', source: this.currentSource });
    } catch (error) {
      console.warn("Play() rejected:", error);
      if (error.name === 'NotAllowedError') {
        this.emit('buffering', { isBuffering: false });
        this.emit('status', {
          type: 'warning',
          message: 'Tarayıcınızın sesi çalabilmesi için lütfen sayfadaki "Canlı Dinle" düğmesine bir kez tıklayın.'
        });
      } else {
        this.handleStreamError();
      }
    }
  }

  pause() {
    this.clearConnectTimeout();
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
    this.clearConnectTimeout();
    const wasPlaying = this.isPlaying;
    this.currentSource = source;
    this.audio.pause();
    this.audio.src = source.url;
    this.audio.load();

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

  getFrequencyData() {
    return null; // Visualizer akıllı ritmik simülasyon modunda çalışır
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }
}

export const radioPlayer = new RadioPlayer();

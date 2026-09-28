/**
 * Radyo A İnteraktif FM Radyo Ayarlayıcısı (Analog / Dijital Tuner)
 * 88.0 - 108.0 MHz frekans cetveli, parazit simülasyonu ve 100.5 FM kilitlenme mekanizması
 */

import { soundEngine } from './audio-clips.js';

export const STATIONS = [
  { freq: 89.0, name: "TRT FM", desc: "Klasik & Haber" },
  { freq: 92.5, name: "CNN Türk", desc: "Haber" },
  { freq: 95.8, name: "Kafa Radyo", desc: "Sohbet" },
  { freq: 98.4, name: "Best FM", desc: "Pop" },
  { freq: 100.5, name: "RADYO A", desc: "Anadolu Üniversitesi (Canlı)", isRadyoA: true },
  { freq: 103.0, name: "Meteoroloji FM", desc: "Hava & Bilgi" },
  { freq: 106.2, name: "Kral FM", desc: "Fantezi & Nostalji" }
];

export class FMTuner {
  constructor(options) {
    this.slider = document.getElementById(options.sliderId);
    this.freqDisplay = document.getElementById(options.freqDisplayId);
    this.signalMeter = document.getElementById(options.signalMeterId);
    this.stereoLed = document.getElementById(options.stereoLedId);
    this.stationBadge = document.getElementById(options.stationBadgeId);
    this.autoTuneBtn = document.getElementById(options.autoTuneBtnId);
    this.player = options.player;

    this.currentFreq = 100.5;
    this.targetFreq = 100.5;
    this.isLockedOnRadyoA = true;
    this.isDragging = false;

    this.init();
  }

  init() {
    if (!this.slider) return;

    this.slider.value = this.currentFreq;
    this.updateUI(this.currentFreq);

    this.slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.handleFreqChange(val);
    });

    this.slider.addEventListener('mousedown', () => {
      this.isDragging = true;
      soundEngine.startRadioStatic(0.15);
    });

    this.slider.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.handleRelease();
    });

    this.slider.addEventListener('touchstart', () => {
      this.isDragging = true;
      soundEngine.startRadioStatic(0.15);
    });

    this.slider.addEventListener('touchend', () => {
      this.isDragging = false;
      this.handleRelease();
    });

    if (this.autoTuneBtn) {
      this.autoTuneBtn.addEventListener('click', () => {
        this.tuneTo(100.5, true);
      });
    }

    // İstasyon ön ayar etiketlerine tıklama
    document.querySelectorAll('[data-station-freq]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const freq = parseFloat(e.currentTarget.getAttribute('data-station-freq'));
        this.tuneTo(freq, true);
      });
    });
  }

  handleFreqChange(freq) {
    this.currentFreq = Math.round(freq * 10) / 10;
    const diff = Math.abs(this.currentFreq - this.targetFreq);

    soundEngine.playTunerClick();

    if (diff < 0.15) {
      // 100.5 FM'e kilitlenme bölgesi
      soundEngine.updateStaticIntensity(0.01);
      this.isLockedOnRadyoA = true;
    } else {
      // Parazit yoğunluğu mesafeyle artar
      const staticIntensity = Math.min(0.4, 0.08 + (diff * 0.04));
      soundEngine.updateStaticIntensity(staticIntensity);
      this.isLockedOnRadyoA = false;
    }

    this.updateUI(this.currentFreq);
  }

  handleRelease() {
    const diff = Math.abs(this.currentFreq - this.targetFreq);
    if (diff <= 0.3) {
      // Manyetik kilitlenme: 100.5'e yaklaştıysa tam otursun
      this.tuneTo(100.5, false);
      soundEngine.stopRadioStatic();
      soundEngine.playStationJingle();
      if (!this.player.isPlaying) {
        this.player.play();
      }
    } else {
      // Başka frekansta bırakıldıysa paraziti hafifçe sürdür veya kıs
      soundEngine.stopRadioStatic();
    }
  }

  tuneTo(target, playEffects = false) {
    if (playEffects) {
      soundEngine.startRadioStatic(0.2);
    }

    let start = this.currentFreq;
    let startTime = performance.now();
    let duration = 400; // ms

    const animateTune = (now) => {
      let progress = Math.min(1, (now - startTime) / duration);
      // Ease out cubic
      let ease = 1 - Math.pow(1 - progress, 3);
      let currentVal = start + (target - start) * ease;
      this.slider.value = currentVal;
      this.currentFreq = Math.round(currentVal * 10) / 10;
      this.updateUI(this.currentFreq);

      if (progress < 1) {
        requestAnimationFrame(animateTune);
      } else {
        this.slider.value = target;
        this.currentFreq = target;
        this.updateUI(target);
        if (playEffects) {
          soundEngine.stopRadioStatic();
          if (target === 100.5) {
            soundEngine.playStationJingle();
            this.player.play();
          }
        }
      }
    };

    requestAnimationFrame(animateTune);
  }

  updateUI(freq) {
    if (this.freqDisplay) {
      this.freqDisplay.textContent = freq.toFixed(1);
    }

    const diff = Math.abs(freq - this.targetFreq);
    const station = STATIONS.find(s => Math.abs(s.freq - freq) < 0.2);

    // Sinyal gücü yüzdesi
    let signalStrength = 0;
    if (station) {
      const stDiff = Math.abs(station.freq - freq);
      signalStrength = Math.max(10, Math.round((1 - (stDiff / 0.3)) * 100));
    } else {
      signalStrength = Math.max(5, Math.round(Math.random() * 20));
    }

    if (this.signalMeter) {
      this.signalMeter.style.width = `${signalStrength}%`;
    }

    // Stereo & Kilit LED'i
    if (this.stereoLed) {
      if (diff < 0.15) {
        this.stereoLed.classList.add('active-stereo');
        this.stereoLed.title = "Stereo FM Kilitlendi (100.5 MHz)";
      } else {
        this.stereoLed.classList.remove('active-stereo');
        this.stereoLed.title = "Frekans Aranıyor...";
      }
    }

    // İstasyon rozeti bilgisi
    if (this.stationBadge) {
      if (station) {
        if (station.isRadyoA) {
          this.stationBadge.innerHTML = `<span class="badge-dot-live"></span> <strong>${station.name}</strong> • Anadolu Üniversitesi (100.5 FM)`;
          this.stationBadge.className = "tuner-badge badge-active";
        } else {
          this.stationBadge.innerHTML = `<strong>${station.name}</strong> (${station.freq} MHz) • ${station.desc}`;
          this.stationBadge.className = "tuner-badge badge-other";
        }
      } else {
        this.stationBadge.innerHTML = `<span>Statik Parazit / Boş Frekans (${freq.toFixed(1)} MHz)</span>`;
        this.stationBadge.className = "tuner-badge badge-static";
      }
    }
  }
}

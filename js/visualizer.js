/**
 * Radyo A Canvas Ses Görselleştirici & Çift İbreli Analog VU Metre
 * Gerçek zamanlı frekans spektrumu, dalga formu ve profesyonel mikser ibreleri
 */

export class StudioVisualizer {
  constructor(canvasId, vuLeftId, vuRightId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.vuLeftNeedle = document.getElementById(vuLeftId);
    this.vuRightNeedle = document.getElementById(vuRightId);
    this.animationFrame = null;
    this.audioPlayer = null;
    this.isRunning = false;

    // Simüle veri için faz ve dinamik değişkenler
    this.simulatedPhase = 0;
    this.leftVULevel = 0;
    this.rightVULevel = 0;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  setPlayer(player) {
    this.audioPlayer = player;
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.drawIdle();
    this.resetVUMeters();
  }

  loop() {
    if (!this.isRunning) return;
    this.draw();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }

  drawIdle() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Durgun dalga çizgisi
    this.ctx.beginPath();
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(w, h / 2);
    this.ctx.strokeStyle = "rgba(227, 6, 19, 0.25)";
    this.ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
    this.ctx.stroke();
  }

  resetVUMeters() {
    if (this.vuLeftNeedle) this.vuLeftNeedle.style.transform = `rotate(-45deg)`;
    if (this.vuRightNeedle) this.vuRightNeedle.style.transform = `rotate(-45deg)`;
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const isPlaying = this.audioPlayer && this.audioPlayer.isPlaying;
    const freqData = isPlaying ? this.audioPlayer.getFrequencyData() : null;

    let bars = 48;
    let barWidth = (w / bars) - 2;
    let avgEnergy = 0;

    // Gradient paleti: Radyo A Kırmızı, Amber & Kampüs Altını
    const gradient = this.ctx.createLinearGradient(0, h, 0, 0);
    gradient.addColorStop(0, '#e30613');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#38bdf8');

    if (isPlaying) {
      this.simulatedPhase += 0.08;

      for (let i = 0; i < bars; i++) {
        let value = 0;
        if (freqData && freqData.length > 0) {
          const idx = Math.floor((i / bars) * (freqData.length * 0.6));
          value = freqData[idx] / 255;
        } else {
          // Gerçekçi simüle ritmik frekans
          const bassBoost = i < 10 ? 0.35 : 0;
          const wave1 = Math.sin(this.simulatedPhase * 1.5 + i * 0.3);
          const wave2 = Math.cos(this.simulatedPhase * 0.8 + i * 0.15);
          const noise = (Math.random() - 0.5) * 0.12;
          value = Math.max(0.1, (wave1 * 0.3 + wave2 * 0.3 + 0.45 + bassBoost + noise));
        }

        avgEnergy += value;
        const barHeight = Math.max(4, value * (h * 0.85));
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Çubuk çizimi (yuvarlatılmış tepe)
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        if (this.ctx.roundRect) {
          this.ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        } else {
          this.ctx.rect(x, y, barWidth, barHeight);
        }
        this.ctx.fill();

        // Tepe noktası ışıltısı
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(x, Math.max(0, y - 3), barWidth, 2);
      }

      avgEnergy = avgEnergy / bars;

      // Analog İbreli VU Metre Güncellemesi
      this.updateVUMeters(avgEnergy);
    } else {
      this.drawIdle();
      this.resetVUMeters();
    }
  }

  updateVUMeters(energy) {
    // -45 derece (en sol - sıfır ses) ile +45 derece (+3dB pik) arası
    const targetLeft = -45 + (energy * 80) + ((Math.random() - 0.5) * 6);
    const targetRight = -45 + (energy * 76) + ((Math.random() - 0.5) * 8);

    this.leftVULevel += (targetLeft - this.leftVULevel) * 0.25;
    this.rightVULevel += (targetRight - this.rightVULevel) * 0.25;

    const clampedL = Math.max(-45, Math.min(45, this.leftVULevel));
    const clampedR = Math.max(-45, Math.min(45, this.rightVULevel));

    if (this.vuLeftNeedle) this.vuLeftNeedle.style.transform = `rotate(${clampedL}deg)`;
    if (this.vuRightNeedle) this.vuRightNeedle.style.transform = `rotate(${clampedR}deg)`;
  }
}

/**
 * Radyo A - Ana Uygulama Modülü (Main Application Coordinator)
 * Anadolu Üniversitesi 100.5 FM Web Platformu
 */

import { radioPlayer, STREAM_SOURCES } from './audio-player.js';
import { StudioVisualizer } from './visualizer.js';
import { FMTuner } from './tuner.js';
import { SCHEDULE_DATA, getCurrentProgram } from './schedule-data.js';
import { RequestSystem } from './request-system.js';
import { soundEngine } from './audio-clips.js';

// Top 10 Anadolu Listesi Verisi
const TOP_10_DATA = [
  { rank: 1, change: "same", title: "Cambaz", artist: "Mor ve Ötesi", album: "Dünya Yalan Söylüyor", votes: 412 },
  { rank: 2, change: "up", title: "Dinle Beni Bi", artist: "Yüzyüzeyken Konuşuruz", album: "Akustik", votes: 389 },
  { rank: 3, change: "up", title: "Koyu", artist: "Duman", album: "Seni Kendime Sakladım", votes: 364 },
  { rank: 4, change: "down", title: "Dönence", artist: "Barış Manço & Kurtalan Ekspres", album: "Sözüm Meclisten Dışarı", votes: 341 },
  { rank: 5, change: "up", title: "Bi Seni Konuşurum", artist: "Göksel", album: "Bende Bi Aşk Var", votes: 318 },
  { rank: 6, change: "new", title: "Bir Derdim Var", artist: "Mor ve Ötesi", album: "Klasikler", votes: 295 },
  { rank: 7, change: "down", title: "Resimdeki Gözyaşları", artist: "Cem Karaca", album: "Anadolu Rock", votes: 280 },
  { rank: 8, change: "up", title: "Antidepresan Gülümsemesi", artist: "Model", album: "Diğer Masallar", votes: 260 },
  { rank: 9, change: "same", title: "Ben Seni Çok Sevdim", artist: "Cem Adrian", album: "Şeker Prens ve Yedi Cüce", votes: 245 },
  { rank: 10, change: "down", title: "Böyle Kahpedir Dünya", artist: "Athena", album: "İt", votes: 230 }
];

// Podcast Arşiv Verisi
const PODCASTS_DATA = [
  {
    id: "pod-1",
    title: "İletişim Masası: Yeni Medyada Yapay Zeka ve Gazetecilik",
    host: "Prof. Dr. Hakan Aydın & İBF Öğrencileri",
    date: "25 Eylül 2026",
    duration: "42 dk",
    category: "Akademi & Medya",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Algoritmik gazetecilik, teyit mekanizmaları ve iletişim fakültelerinin dijital dönüşümü üzerine derinlemesine analiz."
  },
  {
    id: "pod-2",
    title: "Eskişehir Müzik Sahnesi: Porsuk'un Tınıları",
    host: "Ece Demir & Konuk: Porsuk Akustik Grubu",
    date: "21 Eylül 2026",
    duration: "35 dk",
    category: "Müzik & Canlı Performans",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "Eskişehir'de kurulan genç müzik gruplarının stüdyo canlı performansları ve albüm yolculukları."
  },
  {
    id: "pod-3",
    title: "Sinestezi: Bağımsız Sinema ve Film Festivalleri",
    host: "Burak Şen (RTS Kulübü)",
    date: "17 Eylül 2026",
    duration: "48 dk",
    category: "Sinema",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "Uluslararası Eskişehir Film Festivali'nin perde arkası, ödüllü kısa filmler ve genç yönetmenler."
  },
  {
    id: "pod-4",
    title: "Girişimci Kampüs: Anadolu Üniversitesi Teknopark Başarıları",
    host: "Arda Güler & Konuk Mühendisler",
    date: "12 Eylül 2026",
    duration: "38 dk",
    category: "Teknoloji",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description: "Öğrencilik yıllarında filizlenen yazılım girişimleri ve uluslararası fonlanan teknoloji projeleri."
  }
];

class App {
  constructor() {
    this.visualizer = null;
    this.tuner = null;
    this.requestSystem = null;
    this.selectedDayId = "pazartesi";
  }

  init() {
    this.initVisualizer();
    this.initTuner();
    this.initPlayerControls();
    this.initScheduleUI();
    this.initTop10UI();
    this.initPodcastsUI();
    this.initThemeToggle();
    this.requestSystem = new RequestSystem();

    // Yayındaki programı güncelle ve her dakika tazele
    this.updateCurrentProgramCard();
    setInterval(() => this.updateCurrentProgramCard(), 60000);

    // Stüdyo Jingle butonu
    const jingleBtn = document.getElementById('btn-play-jingle');
    if (jingleBtn) {
      jingleBtn.addEventListener('click', () => {
        soundEngine.playStationJingle();
      });
    }

    // Mobil Menü
    this.initMobileNav();
  }

  initVisualizer() {
    this.visualizer = new StudioVisualizer('visualizer-canvas', 'vu-needle-left', 'vu-needle-right');
    this.visualizer.setPlayer(radioPlayer);
    this.visualizer.drawIdle();
  }

  initTuner() {
    this.tuner = new FMTuner({
      sliderId: 'fm-slider',
      freqDisplayId: 'digital-freq-num',
      signalMeterId: 'signal-strength-bar',
      stereoLedId: 'stereo-indicator-led',
      stationBadgeId: 'active-station-display',
      autoTuneBtnId: 'btn-auto-tune',
      player: radioPlayer
    });
  }

  initPlayerControls() {
    const playBtn = document.getElementById('master-play-btn');
    const heroPlayBtn = document.getElementById('hero-quick-play');
    const playIcon = document.getElementById('master-play-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const muteBtn = document.getElementById('btn-mute');
    const sourceSelector = document.getElementById('stream-source-select');
    const onAirBadges = document.querySelectorAll('.on-air-indicator');
    const statusText = document.getElementById('player-status-text');

    const updatePlayUI = (isPlaying) => {
      if (isPlaying) {
        if (playBtn) playBtn.classList.add('playing');
        if (heroPlayBtn) heroPlayBtn.classList.add('playing');
        if (playIcon) {
          playIcon.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`;
        }
        if (heroPlayBtn) {
          heroPlayBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg><span>Yayını Durdur</span>`;
        }
        onAirBadges.forEach(b => b.classList.add('live-glow'));
        this.visualizer.start();
        if (statusText) statusText.textContent = "CANLI YAYIN AKTİF • 100.5 FM";
      } else {
        if (playBtn) playBtn.classList.remove('playing');
        if (heroPlayBtn) heroPlayBtn.classList.remove('playing');
        if (playIcon) {
          playIcon.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        }
        if (heroPlayBtn) {
          heroPlayBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Canlı Dinle (100.5 FM)</span>`;
        }
        onAirBadges.forEach(b => b.classList.remove('live-glow'));
        this.visualizer.stop();
        if (statusText) statusText.textContent = "YAYIN BEKLEMEDE • 100.5 FM";
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => radioPlayer.togglePlay());
    }
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', () => radioPlayer.togglePlay());
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        radioPlayer.setVolume(parseFloat(e.target.value));
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = radioPlayer.toggleMute();
        muteBtn.innerHTML = isMuted 
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      });
    }

    if (sourceSelector) {
      sourceSelector.innerHTML = STREAM_SOURCES.map((s, idx) => `
        <option value="${s.id}">${s.name} (${s.badge})</option>
      `).join('');
      sourceSelector.value = radioPlayer.currentSource.id;

      sourceSelector.addEventListener('change', (e) => {
        const selected = STREAM_SOURCES.find(s => s.id === e.target.value);
        if (selected) {
          radioPlayer.switchSource(selected, radioPlayer.isPlaying);
        }
      });

      radioPlayer.on('sourcechange', ({ source }) => {
        if (sourceSelector && source) {
          sourceSelector.value = source.id;
        }
      });
    }

    // Player dinleyicileri
    radioPlayer.on('statechange', ({ isPlaying }) => updatePlayUI(isPlaying));

    radioPlayer.on('buffering', ({ isBuffering, message }) => {
      const buffEl = document.getElementById('player-buffering-badge');
      if (buffEl) {
        buffEl.style.display = isBuffering ? 'flex' : 'none';
        if (message) {
          buffEl.querySelector('.buffering-text').textContent = message;
        }
      }
    });

    radioPlayer.on('status', ({ type, message }) => {
      const banner = document.getElementById('stream-notice-banner');
      if (banner) {
        banner.className = `stream-notice-bar notice-${type}`;
        banner.innerHTML = `
          <span>${message}</span>
          ${type === 'fallback' ? `<button id="btn-retry-live" class="btn-notice-action">Tekrar Dene</button>` : ''}
        `;
        banner.style.display = 'flex';

        const retryBtn = document.getElementById('btn-retry-live');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            radioPlayer.switchSource(STREAM_SOURCES[0], true);
            banner.style.display = 'none';
          });
        }
      }
    });
  }

  updateCurrentProgramCard() {
    const { program, day, nextProgram, progressPercent } = getCurrentProgram();

    const titleEl = document.getElementById('now-playing-title');
    const hostEl = document.getElementById('now-playing-host');
    const timeEl = document.getElementById('now-playing-time');
    const descEl = document.getElementById('now-playing-desc');
    const tagEl = document.getElementById('now-playing-tag');
    const progressFill = document.getElementById('now-playing-progress-fill');
    const nextEl = document.getElementById('next-program-teaser');

    if (titleEl) titleEl.textContent = program.title;
    if (hostEl) hostEl.textContent = `Sunucu: ${program.host}`;
    if (timeEl) timeEl.textContent = `${program.start} - ${program.end}`;
    if (descEl) descEl.textContent = program.description;
    if (tagEl) tagEl.textContent = `${program.category} • ${program.tag}`;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    if (nextEl && nextProgram) {
      nextEl.innerHTML = `<strong>Sırada:</strong> ${nextProgram.start} - ${nextProgram.title} (${nextProgram.host})`;
    }
  }

  initScheduleUI() {
    const daysContainer = document.getElementById('schedule-days-tabs');
    const listContainer = document.getElementById('schedule-programs-list');
    const categoryFilter = document.getElementById('schedule-category-filter');

    if (!daysContainer || !listContainer) return;

    // Günün güncel gününü seçili yap (0: Pazar, 1: Pzt ...)
    const nowDay = new Date().getDay();
    const todayObj = SCHEDULE_DATA.days.find(d => d.dayIndex === nowDay) || SCHEDULE_DATA.days[0];
    this.selectedDayId = todayObj.id;

    // Gün butonları
    daysContainer.innerHTML = SCHEDULE_DATA.days.map(d => `
      <button class="day-tab-btn ${d.id === this.selectedDayId ? 'active' : ''}" data-day="${d.id}">
        <span class="day-name">${d.name}</span>
        <span class="day-short">${d.short}</span>
        ${d.dayIndex === nowDay ? `<span class="today-dot" title="Bugün"></span>` : ''}
      </button>
    `).join('');

    daysContainer.querySelectorAll('.day-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        daysContainer.querySelectorAll('.day-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDayId = btn.getAttribute('data-day');
        this.renderScheduleList();
      });
    });

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        this.renderScheduleList();
      });
    }

    this.renderScheduleList();
  }

  renderScheduleList() {
    const listContainer = document.getElementById('schedule-programs-list');
    const categoryFilter = document.getElementById('schedule-category-filter');
    if (!listContainer) return;

    const selectedDay = SCHEDULE_DATA.days.find(d => d.id === this.selectedDayId) || SCHEDULE_DATA.days[0];
    const catVal = categoryFilter ? categoryFilter.value : 'all';

    let progs = selectedDay.programs;
    if (catVal !== 'all') {
      progs = progs.filter(p => p.category.toLowerCase().includes(catVal.toLowerCase()));
    }

    const { program: currentLive } = getCurrentProgram();
    const isToday = selectedDay.dayIndex === new Date().getDay();

    if (progs.length === 0) {
      listContainer.innerHTML = `<div class="empty-state">Bu kategoride program bulunamadı.</div>`;
      return;
    }

    listContainer.innerHTML = progs.map(p => {
      const isLiveNow = isToday && p.id === currentLive.id;
      return `
        <div class="schedule-card ${isLiveNow ? 'card-live-now' : ''}">
          <div class="sched-time-badge">
            <span class="sched-start">${p.start}</span>
            <span class="sched-sep">-</span>
            <span class="sched-end">${p.end}</span>
            ${isLiveNow ? `<span class="badge-live-pulse"><span class="pulse-dot"></span> YAYINDA</span>` : ''}
          </div>
          <div class="sched-info">
            <div class="sched-header">
              <h3 class="sched-title">${p.title}</h3>
              <span class="sched-tag">${p.category}</span>
            </div>
            <div class="sched-host">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${p.host}
            </div>
            <p class="sched-desc">${p.description}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  initTop10UI() {
    const listEl = document.getElementById('top10-list-container');
    if (!listEl) return;

    let savedVotes = {};
    try {
      savedVotes = JSON.parse(localStorage.getItem('radyo_a_top10_voted') || '{}');
    } catch (e) {}

    const renderList = () => {
      listEl.innerHTML = TOP_10_DATA.map(item => {
        const hasVoted = !!savedVotes[item.rank];
        const changeIcon = item.change === 'up' 
          ? `<span class="trend up" title="Yükseldi">▲</span>` 
          : item.change === 'down' 
            ? `<span class="trend down" title="Düştü">▼</span>` 
            : `<span class="trend same" title="Sabit">▬</span>`;

        return `
          <div class="top10-card">
            <div class="top10-rank">
              <span class="rank-number">${item.rank}</span>
              ${changeIcon}
            </div>
            <div class="top10-details">
              <h4 class="top10-song">${item.title}</h4>
              <p class="top10-artist">${item.artist} <span class="album-name">• ${item.album}</span></p>
            </div>
            <div class="top10-actions">
              <button class="btn-vote-song ${hasVoted ? 'voted' : ''}" data-rank="${item.rank}" title="Bu parçaya oy ver">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${hasVoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span class="vote-count">${item.votes}</span>
              </button>
            </div>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.btn-vote-song').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const rank = parseInt(btn.getAttribute('data-rank'));
          const song = TOP_10_DATA.find(s => s.rank === rank);
          if (song && !savedVotes[rank]) {
            song.votes += 1;
            savedVotes[rank] = true;
            localStorage.setItem('radyo_a_top10_voted', JSON.stringify(savedVotes));
            renderList();
          }
        });
      });
    };

    renderList();
  }

  initPodcastsUI() {
    const container = document.getElementById('podcasts-grid-container');
    if (!container) return;

    container.innerHTML = PODCASTS_DATA.map(p => `
      <div class="podcast-card">
        <div class="pod-header">
          <span class="pod-category">${p.category}</span>
          <span class="pod-duration">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${p.duration}
          </span>
        </div>
        <h4 class="pod-title">${p.title}</h4>
        <div class="pod-meta">
          <span class="pod-host">${p.host}</span>
          <span class="pod-date">${p.date}</span>
        </div>
        <p class="pod-desc">${p.description}</p>
        <button class="btn-play-podcast" data-audio="${p.audioUrl}" data-title="${p.title}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Bölümü Dinle
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-play-podcast').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audioUrl = btn.getAttribute('data-audio');
        const title = btn.getAttribute('data-title');
        radioPlayer.playEpisode(audioUrl, title);
        // Sayfayı ses oynatıcısına kaydır
        document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    const currentTheme = localStorage.getItem('radyo_a_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const updateIcon = (theme) => {
      themeBtn.innerHTML = theme === 'light'
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    };
    updateIcon(currentTheme);

    themeBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const nextTheme = active === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('radyo_a_theme', nextTheme);
      updateIcon(nextTheme);
    });
  }

  initMobileNav() {
    const burger = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu-links');
    if (!burger || !navMenu) return;

    burger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
      });
    });
  }
}

// Uygulamayı DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

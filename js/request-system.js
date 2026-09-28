/**
 * Radyo A İstek Hattı & Canlı Stüdyo Mesajlaşma Sistemi
 * Dinleyici istekleri, stüdyo mesajları ve anlık DJ yanıt mekanizması
 */

const DEFAULT_MESSAGES = [
  {
    id: 1,
    sender: "Zeynep T.",
    department: "İletişim Bilimleri Fakültesi (RTS)",
    song: "Mor ve Ötesi - Cambaz",
    note: "Kurgu atölyesinde sabahlayan tüm arkadaşlara gelsin, harikasınız!",
    time: "3 dk önce",
    djResponse: "DJ Berk: Kurguculara stüdyodan selamlar! Şarkınız birazdan yayında 🎧"
  },
  {
    id: 2,
    sender: "Mert & Ece",
    department: "İktisadi ve İdari Bilimler Fakültesi",
    song: "Duman - Haberin Yok Ölüyorum",
    note: "Porsuk kenarında Radyo A dinliyoruz, Eskişehir'e selamlar!",
    time: "12 dk önce",
    djResponse: "DJ İrem: Porsuk'un güzel havasına selam olsun, keyifli dinlemeler!"
  },
  {
    id: 3,
    sender: "Can K.",
    department: "Mühendislik Fakültesi",
    song: "Cem Karaca - Tamirci Çırağı",
    note: "Laboratuvardayız, Anadolu Rock kuşağını heyecanla bekliyoruz.",
    time: "24 dk önce",
    djResponse: "DJ Oğuz: Anadolu Rock kuşağında tam sana göre bir set hazırladım Can!"
  },
  {
    id: 4,
    sender: "Seda Akın",
    department: "Eğitim Fakültesi",
    song: "Yüzyüzeyken Konuşuruz - Dinle Beni Bi",
    note: "Sınav haftası stresine en iyi ilaç Radyo A 100.5!",
    time: "35 dk önce",
    djResponse: "Stüdyo: Bütün öğrencilere finallerde başarılar diliyoruz, moraliniz yüksek olsun!"
  }
];

export class RequestSystem {
  constructor() {
    this.messages = this.loadMessages();
    this.init();
  }

  loadMessages() {
    try {
      const stored = localStorage.getItem('radyo_a_requests');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return DEFAULT_MESSAGES;
  }

  saveMessages() {
    try {
      localStorage.setItem('radyo_a_requests', JSON.stringify(this.messages));
    } catch (e) {}
  }

  init() {
    this.renderTicker();
    this.setupForm();
  }

  renderTicker() {
    const tickerContainer = document.getElementById('studio-requests-feed');
    if (!tickerContainer) return;

    tickerContainer.innerHTML = this.messages.map(msg => `
      <div class="request-item-card">
        <div class="req-header">
          <div class="req-user">
            <span class="user-avatar">${msg.sender.charAt(0)}</span>
            <div>
              <span class="user-name">${msg.sender}</span>
              <span class="user-dept">${msg.department}</span>
            </div>
          </div>
          <span class="req-time">${msg.time}</span>
        </div>
        <div class="req-song">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          <strong>${msg.song}</strong>
        </div>
        <p class="req-note">"${msg.note}"</p>
        ${msg.djResponse ? `
          <div class="dj-response-badge">
            <span class="badge-dot-live"></span>
            ${msg.djResponse}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  setupForm() {
    const form = document.getElementById('song-request-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = document.getElementById('req-name').value.trim();
      const department = document.getElementById('req-dept').value.trim() || 'Anadolu Üniversitesi';
      const song = document.getElementById('req-song-title').value.trim();
      const note = document.getElementById('req-message').value.trim();

      if (!sender || !song) {
        alert("Lütfen adınızı ve istediğiniz şarkıyı belirtin.");
        return;
      }

      const djNames = ["DJ Berk", "DJ İrem", "DJ Caner", "DJ Zeynep", "DJ Oğuz"];
      const randomDJ = djNames[Math.floor(Math.random() * djNames.length)];

      const newMsg = {
        id: Date.now(),
        sender,
        department,
        song,
        note: note || "Radyo A stüdyolarına sevgiler!",
        time: "Şimdi",
        djResponse: `${randomDJ}: Harika seçim! İsteğin canlı yayın sırasına alındı 📻`
      };

      this.messages.unshift(newMsg);
      if (this.messages.length > 20) this.messages.pop();
      this.saveMessages();
      this.renderTicker();

      // Formu temizle ve başarı mesajı göster
      form.reset();
      const feedback = document.getElementById('req-feedback');
      if (feedback) {
        feedback.innerHTML = `
          <div class="alert alert-success">
            <strong>Tebrikler!</strong> İstek parçanız ve mesajınız stüdyo mikserine başarıyla iletildi. Birazdan canlı yayında seslendirilecek!
          </div>
        `;
        setTimeout(() => {
          feedback.innerHTML = '';
        }, 5000);
      }
    });
  }
}

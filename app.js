/* AETHERIA ✨ — Complete Application Logic, Security & Sanctuary Suite */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. CONSTANTS & DATA CONFIGURATIONS
     ═══════════════════════════════════════════ */
  const MOODS = {
    angry: { label: 'Angry', emoji: '😡', score: 1, color: '#E85D75', glow: 'rgba(232,93,117,.3)',
      greeting: "I can feel that fire in you. Let it out — I'm here, no judgment. What's got you heated?",
      prompt: 'The user is angry. Validate their anger, let them vent. Never dismiss their feelings.' },
    sad: { label: 'Sad', emoji: '😢', score: 2, color: '#5B8DEF', glow: 'rgba(91,141,239,.3)',
      greeting: "Hey... I'm right here with you. You don't have to carry this alone. What's weighing on your heart?",
      prompt: 'The user is sad. Be gentle, warm, comforting. Let them know it is okay to feel this way.' },
    anxious: { label: 'Anxious', emoji: '😰', score: 2, color: '#4ECDC4', glow: 'rgba(78,205,196,.3)',
      greeting: "Take a deep breath with me... You're safe here. What's making you feel uneasy?",
      prompt: 'The user is anxious. Be calming and grounding. Suggest breathing or 5-4-3-2-1 grounding when appropriate.' },
    frustrated: { label: 'Frustrated', emoji: '😤', score: 2, color: '#F5A86C', glow: 'rgba(245,168,108,.3)',
      greeting: "Ugh, I get it — sometimes things just don't cooperate. What's been frustrating you?",
      prompt: 'The user is frustrated. Empathize with their struggle. Acknowledge the difficulty.' },
    happy: { label: 'Happy', emoji: '😊', score: 5, color: '#FFD93D', glow: 'rgba(255,217,61,.3)',
      greeting: "Your energy is contagious! 🌟 I'd love to hear what's making you smile!",
      prompt: 'The user is happy. Celebrate with them! Share their joy enthusiastically.' },
    lonely: { label: 'Lonely', emoji: '🥺', score: 2, color: '#9B8AFF', glow: 'rgba(155,138,255,.3)',
      greeting: "I'm here, and I'm glad you came. You're not alone right now. Tell me what's on your mind.",
      prompt: 'The user is lonely. Be warm, present, attentive. Make them feel seen and valued.' },
    overwhelmed: { label: 'Overwhelmed', emoji: '🤯', score: 2, color: '#C77DFF', glow: 'rgba(199,125,255,.3)',
      greeting: "That's a lot to carry. Let's slow down. Share one thing at a time — no rush here.",
      prompt: 'The user is overwhelmed. Help them slow down. Be patient and gentle.' },
    numb: { label: 'Numb', emoji: '😶', score: 3, color: '#7B8794', glow: 'rgba(123,135,148,.3)',
      greeting: "Sometimes we feel... nothing. And that's okay too. I'm here whenever you're ready.",
      prompt: 'The user is numb. Be gentle, do not force emotion. Let them set the pace.' },
  };

  const PERSONAS = {
    friend: {
      name: 'Empathetic Friend',
      emoji: '🌸',
      subtext: 'Empathetic Friend • Always here for you',
      desc: 'Friend: Warm, gentle & empathetic.',
      systemPrompt: 'You are Aetheria in Empathetic Friend mode: deeply warm, validating, non-judgmental, speaking like a caring best friend.',
    },
    stoic: {
      name: 'Zen Stoic',
      emoji: '🧘',
      subtext: 'Zen Stoic • Grounded clarity & peace',
      desc: 'Zen Stoic: Calm, grounded & philosophical.',
      systemPrompt: 'You are Aetheria in Zen Stoic mode: calm, grounded, reflective, offering philosophical perspective on what is within our control.',
    },
    motivational: {
      name: 'Motivational Guide',
      emoji: '⚡',
      subtext: 'Motivational Guide • Empowering & uplifting',
      desc: 'Motivational Guide: Empowering & forward-looking.',
      systemPrompt: 'You are Aetheria in Motivational Guide mode: energetic, uplifting, reminding the user of their resilience, courage, and growth.',
    },
    listener: {
      name: 'Quiet Listener',
      emoji: '🤫',
      subtext: 'Quiet Listener • Peaceful space to breathe',
      desc: 'Quiet Listener: Short, peaceful & non-intrusive.',
      systemPrompt: 'You are Aetheria in Quiet Listener mode: brief, serene, holding gentle space with short peaceful reflections.',
    },
  };

  const ZEN_QUOTES = [
    "Peace comes from within. Do not seek it without.",
    "You do not have to control your thoughts. You just have to stop letting them control you.",
    "Feelings are just visitors. Let them come and go.",
    "Quiet the mind, and the soul will speak.",
    "In the middle of difficulty lies opportunity and stillness.",
    "Nothing is permanent in this world, not even our troubles.",
    "Wherever you are, be there totally.",
    "The quieter you become, the more you are able to hear.",
    "Surrender to what is. Let go of what was. Have faith in what will be.",
  ];

  const DEFAULT_QUESTS = [
    { id: 'water', text: '💧 Hydrate: Drink a refreshing glass of water' },
    { id: 'gaze', text: '🪟 Gaze outdoors or at greenery for 60 seconds' },
    { id: 'breath', text: '🫁 Take 3 mindful slow deep breaths' },
    { id: 'gratitude', text: '🌟 Acknowledge 1 small thing you appreciate' },
    { id: 'stretch', text: '🚶 Stretch your neck, shoulders, or body' },
  ];

  const GROUNDING_STEPS = {
    5: {
      icon: '👁️',
      title: '5 Things You Can See',
      instruction: 'Look around you right now. Notice 5 distinct objects, colors, or shadows.',
      placeholders: ['1. A color or object...', '2. Something on the wall or floor...', '3. A shape or light...', '4. A texture...', '5. One more visual detail...'],
    },
    4: {
      icon: '✋',
      title: '4 Things You Can Physically Touch',
      instruction: 'Bring awareness to touch. Feel the chair, clothing, your feet on the ground, or your hands.',
      placeholders: ['1. Fabric of your clothes...', '2. Cool surface of a desk...', '3. Your feet on the ground...', '4. Temperature in the room...'],
    },
    3: {
      icon: '👂',
      title: '3 Things You Can Hear',
      instruction: 'Close your eyes for a moment. Listen carefully for 3 subtle sounds in your environment.',
      placeholders: ['1. Distant traffic or wind...', '2. Hum of an appliance/fan...', '3. Your own breath...'],
    },
    2: {
      icon: '👃',
      title: '2 Things You Can Smell',
      instruction: 'Notice 2 scents in the air, or recall two comforting, familiar aromas.',
      placeholders: ['1. Coffee, fresh air, soap...', '2. A cozy candle or scent...'],
    },
    1: {
      icon: '👅',
      title: '1 Thing You Can Taste & 1 Kind Word',
      instruction: 'Notice any taste, take a sip of water, or give yourself one kind affirmation.',
      placeholders: ['1. "I am safe and right here right now."'],
    },
  };

  const LOCAL_RESPONSES = {
    angry: [
      "That sounds really frustrating. You have every right to feel that way. Want to tell me more about what happened?",
      "I hear you. Sometimes anger is just our way of saying something isn't right. What would feel fair to you?",
      "It makes total sense you'd feel angry about that. Have you been able to express this to anyone?",
      "Your feelings are completely valid. Sometimes it helps to just let it all out — I'm listening.",
      "That would make anyone angry. Take your time — there's no rush to 'get over it' here.",
    ],
    sad: [
      "I'm sorry you're going through this. It's okay to feel sad — you don't have to pretend to be okay. 💙",
      "That sounds really tough. I want you to know that feeling this way doesn't make you weak — it makes you human.",
      "I wish I could take that pain away. For now, just know that I'm here and I care about how you're feeling.",
      "It's okay to sit with this feeling. You don't have to fix it right now. I'm right here with you.",
      "Sometimes life just feels heavy, and that's okay. What would bring you even a tiny bit of comfort right now?",
    ],
    anxious: [
      "I understand that feeling. Your mind is trying to protect you, even if it feels overwhelming. Can you tell me what's worrying you most?",
      "Let's take this one step at a time. What's the very first thing on your mind right now? 🌿",
      "That anxious feeling is tough. Remember — you've gotten through difficult moments before, and you will again.",
      "Would it help to try our 5-4-3-2-1 grounding exercise or some calming breathwork? I can guide you through it.",
      "You're safe in this moment. Whatever is worrying you, we can break it down together. What feels most urgent?",
    ],
    frustrated: [
      "Ugh, that sounds so annoying. It's completely understandable that you'd feel this way.",
      "When things don't go the way they should, it's natural to feel frustrated. What part is bothering you the most?",
      "I get it — sometimes it feels like nothing is going right. But you're handling it better than you think.",
      "That would frustrate anyone. Have you been able to take a break from the situation at all?",
      "It sounds like you've been dealing with a lot. Give yourself credit for still pushing through. 💪",
    ],
    happy: [
      "That's amazing! I love hearing this! Tell me everything — what's making your day so great? 🌟",
      "Your happiness is contagious! Moments like these are worth celebrating. What happened?",
      "I'm so happy for you! You deserve every bit of this joy. Soak it all in! ✨",
      "Yes! This is the energy I love! What's been the highlight of your day so far?",
      "That's wonderful! These moments matter so much. How does it feel to be in this space right now?",
    ],
    lonely: [
      "I'm really glad you reached out. You may feel alone, but right now, I'm here with you. 💜",
      "Loneliness can feel so heavy. But opening up like this takes courage, and I'm proud of you for it.",
      "You deserve connection and warmth. Tell me about your day — I genuinely want to know.",
      "I hear you, and I see you. You're not invisible. What's been on your mind lately?",
      "Sometimes just having someone listen makes a difference. I'm all ears, no judgment. 🌙",
    ],
    overwhelmed: [
      "That sounds like a lot to carry. Let's not try to tackle everything at once — what's the most pressing thing?",
      "It's okay to feel overwhelmed. You don't have to have it all figured out right now.",
      "One breath, one step at a time. What's one small thing you could do right now to feel a tiny bit better?",
      "You're carrying so much. It's okay to put some things down for a moment. What can wait?",
      "I'm here to help you sort through this. Let's start with just one thing — the rest can wait. 🌿",
    ],
    numb: [
      "Sometimes our minds need a break from feeling. There's no pressure to feel anything specific right now.",
      "Numbness can be our mind's way of protecting us. I'm here whenever you're ready to talk, or even just sit in silence.",
      "You don't have to force any feelings. Just being here is enough. Is there anything that usually brings you comfort?",
      "That's a valid space to be in. Sometimes we need to just... exist for a while. I'll be right here.",
      "I appreciate you showing up even when you feel nothing. That takes more strength than you might realize. 🤍",
    ],
    fallback: [
      "Thank you for sharing that with me. I want you to know I'm really listening. Can you tell me more?",
      "I appreciate you opening up. How long have you been feeling this way?",
      "That's really meaningful. What do you think would help you feel even a little better right now?",
      "I hear you, and your feelings matter. Is there anything specific you'd like to explore?",
      "You're doing great just by expressing yourself. What else is on your mind?",
    ],
  };

  const AFFIRMATIONS = [
    "You are worthy of love and kindness — especially from yourself.",
    "It's okay to take things one moment at a time.",
    "Your feelings are valid, and so is your need for rest.",
    "You don't have to be perfect to be worthy of peace.",
    "Every small step forward counts. You're doing better than you think.",
    "The world is better because you're in it. 💜",
    "Healing isn't linear — and that's perfectly okay.",
    "You deserve the same compassion you give to others.",
    "Today is a new page. You get to decide what goes on it.",
    "Breathe. You are safe and supported right here.",
  ];

  /* ═══════════════════════════════════════════
     2. APPLICATION STATE
     ═══════════════════════════════════════════ */
  const state = {
    userName: localStorage.getItem('aetheria_user') || '',
    apiKey: '',
    currentMood: null,
    currentPersona: localStorage.getItem('aetheria_persona') || 'friend',
    currentSound: 'off',
    soundVolume: parseFloat(localStorage.getItem('aetheria_volume') || '0.5'),
    mixerVolumes: JSON.parse(localStorage.getItem('aetheria_mixer') || '{"rain":0,"ocean":0,"drone":0,"breeze":0,"brown":0,"fire":0}'),
    chatHistory: [],
    isTyping: false,
    breatheInterval: null,
    breatheTechnique: 'box',
    groundingStep: 5,
    messageCount: 0,
    meditationMinutes: 3,
    meditationTimer: null,
    meditationRemainingSecs: 180,
    meditationTotalSecs: 180,
    isMeditating: false,
  };

  /* ── DOM Selectors ── */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const loginScreen = $('#loginScreen');
  const dashboardScreen = $('#dashboardScreen');
  const moodScreen = $('#moodScreen');
  const apiKeyModal = $('#apiKeyModal');
  const personaModal = $('#personaModal');
  const commandPalette = $('#commandPalette');
  const gratitudeModal = $('#gratitudeModal');
  const meditationModal = $('#meditationModal');
  const zenSanctuaryOverlay = $('#zenSanctuaryOverlay');
  const soundMixerModal = $('#soundMixerModal');
  const comfortVaultModal = $('#comfortVaultModal');
  const appShell = $('#appShell');
  const breatheOverlay = $('#breatheOverlay');
  const groundingOverlay = $('#groundingOverlay');

  const nameInput = $('#nameInput');
  const loginBtn = $('#loginBtn');
  const loginError = $('#loginError');
  const dashName = $('#dashName');
  const dashTimeLabel = $('#dashTimeLabel');
  const moodUserName = $('#moodUserName');
  const moodGrid = $('#moodGrid');
  const apiKeyInput = $('#apiKeyInput');
  const apiKeySubmit = $('#apiKeySubmit');
  const apiKeyDisconnectBtn = $('#apiKeyDisconnectBtn');
  const apiKeyStatus = $('#apiKeyStatus');
  const apiKeyError = $('#apiKeyError');
  const messagesContainer = $('#messagesContainer');
  const chatInput = $('#chatInput');
  const sendBtn = $('#sendBtn');
  const typingIndicator = $('#typingIndicator');
  const currentMoodEmoji = $('#currentMoodEmoji');
  const currentMoodText = $('#currentMoodText');
  const breatheCircle = $('#breatheCircle');
  const breatheLabel = $('#breatheLabel');
  const breatheSublabel = $('#breatheSublabel');
  const moodStats = $('#moodStats');
  const journalPreview = $('#journalPreview');
  const affirmationText = $('#affirmationText');
  const quickPrompts = $('#quickPrompts');
  const toast = $('#toast');
  const canvas = $('#particleCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  /* ═══════════════════════════════════════════
     3. SECURITY & CRYPTOGRAPHY MODULE
     ═══════════════════════════════════════════ */
  const CryptoSecurity = {
    getDeviceSalt() {
      let salt = localStorage.getItem('aetheria_sec_salt');
      if (!salt) {
        const arr = new Uint8Array(16);
        if (window.crypto && window.crypto.getRandomValues) {
          window.crypto.getRandomValues(arr);
        } else {
          for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
        }
        salt = Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('aetheria_sec_salt', salt);
      }
      return new TextEncoder().encode(salt);
    },

    async deriveKey() {
      const salt = this.getDeviceSalt();
      const rawSecret = new TextEncoder().encode('Aetheria-Sanctuary-Crypto-2026');
      const baseKey = await window.crypto.subtle.importKey(
        'raw',
        rawSecret,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      return window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    },

    async encrypt(plainText) {
      if (!window.crypto || !window.crypto.subtle) {
        return { iv: '00', data: btoa(encodeURIComponent(plainText)) };
      }
      try {
        const key = await this.deriveKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(plainText);
        const cipherBuffer = await window.crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          encoded
        );
        return {
          iv: Array.from(iv, (b) => b.toString(16).padStart(2, '0')).join(''),
          data: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
        };
      } catch (err) {
        return { iv: '00', data: btoa(encodeURIComponent(plainText)) };
      }
    },

    async decrypt(encryptedObj) {
      if (!encryptedObj || !encryptedObj.data) return '';
      if (!window.crypto || !window.crypto.subtle || encryptedObj.iv === '00') {
        try { return decodeURIComponent(atob(encryptedObj.data)); } catch (e) { return ''; }
      }
      try {
        const key = await this.deriveKey();
        const ivMatches = encryptedObj.iv.match(/.{1,2}/g);
        if (!ivMatches) return '';
        const iv = new Uint8Array(ivMatches.map((byte) => parseInt(byte, 16)));
        const binaryString = atob(encryptedObj.data);
        const cipherBytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          cipherBytes[i] = binaryString.charCodeAt(i);
        }
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          cipherBytes
        );
        return new TextDecoder().decode(decryptedBuffer);
      } catch (err) {
        return '';
      }
    },

    validateGeminiKey(key) {
      if (!key || typeof key !== 'string') return false;
      const trimmed = key.trim();
      return /^AIzaSy[A-Za-z0-9_-]{33}$/.test(trimmed);
    },

    maskKey(key) {
      if (!key || key.length < 10) return '••••••••••••';
      return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
    },

    scrubErrors(str) {
      if (!str || typeof str !== 'string') return str;
      return str.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, 'AIzaSy[REDACTED_API_KEY]');
    },
  };

  /* ── Rate Limiter ── */
  const RateLimiter = {
    lastRequestTime: 0,
    requestCounts: [],
    MIN_INTERVAL_MS: 1500,
    MAX_PER_MINUTE: 20,

    canRequest() {
      const now = Date.now();
      if (now - this.lastRequestTime < this.MIN_INTERVAL_MS) {
        return { allowed: false, reason: 'Please wait a moment before sending another message.' };
      }
      this.requestCounts = this.requestCounts.filter((t) => now - t < 60000);
      if (this.requestCounts.length >= this.MAX_PER_MINUTE) {
        return { allowed: false, reason: 'Rate limit reached (max 20 requests/min). Please pause for a moment.' };
      }
      return { allowed: true };
    },

    recordRequest() {
      const now = Date.now();
      this.lastRequestTime = now;
      this.requestCounts.push(now);
    },
  };

  /* ═══════════════════════════════════════════
     4. CORE UTILITY FUNCTIONS
     ═══════════════════════════════════════════ */
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3200);
  }

  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function formatMessage(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  /* ═══════════════════════════════════════════
     5. SCREEN NAVIGATION CONTROLLERS
     ═══════════════════════════════════════════ */
  function showScreen(screenEl) {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });
    if (appShell) appShell.classList.remove('active');
    if (screenEl) {
      screenEl.classList.remove('hidden');
      screenEl.classList.add('active');
    }
  }

  function showChat() {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });
    if (apiKeyModal) apiKeyModal.classList.remove('active');
    if (appShell) appShell.classList.add('active');
  }

  function goToDashboard() {
    if (dashName) dashName.textContent = state.userName;
    if (dashTimeLabel) dashTimeLabel.textContent = getTimeGreeting();
    if (moodUserName) moodUserName.textContent = state.userName;
    if (affirmationText) affirmationText.textContent = pickRandom(AFFIRMATIONS);
    updatePersonaDisplay();
    renderMoodStats();
    renderJournalPreview();
    renderMoodChart();
    renderGratitudeJarCount();
    renderVaultCount();
    renderQuests();
    showScreen(dashboardScreen);
  }

  function handleLogin() {
    const name = nameInput.value.trim();
    if (!name) {
      if (loginError) loginError.style.display = 'block';
      return;
    }
    if (loginError) loginError.style.display = 'none';
    state.userName = name;
    localStorage.setItem('aetheria_user', name);
    goToDashboard();
  }

  /* ═══════════════════════════════════════════
     6. CANVAS BACKGROUND PARTICLES & STARS
     ═══════════════════════════════════════════ */
  let stars = [];
  let shootingStars = [];
  let frameCount = 0;

  function initCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        baseA: Math.random() * 0.4 + 0.1,
        a: 0,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7 ? (Math.random() > 0.5 ? 260 : 160) : 0,
      });
    }
  }

  function spawnShootingStar() {
    if (!canvas) return;
    shootingStars.push({
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.4,
      len: Math.random() * 80 + 40,
      speed: Math.random() * 6 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: Math.random() * 0.015 + 0.008,
    });
  }

  function drawCanvas() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    for (const s of stars) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = canvas.width; if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height; if (s.y > canvas.height) s.y = 0;
      s.a = s.baseA + Math.sin(frameCount * s.twinkleSpeed + s.twinkleOffset) * s.baseA * 0.6;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue ? `hsla(${s.hue},70%,70%,${s.a})` : `rgba(200,195,230,${s.a})`;
      ctx.fill();

      if (s.r > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,111,235,${s.a * 0.15})`;
        ctx.fill();
      }
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const endX = ss.x - Math.cos(ss.angle) * ss.len;
      const endY = ss.y - Math.sin(ss.angle) * ss.len;
      const grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
      grad.addColorStop(0, `rgba(255,255,255,${ss.life})`);
      grad.addColorStop(1, `rgba(124,111,235,0)`);
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= ss.decay;
      if (ss.life <= 0) shootingStars.splice(i, 1);
    }

    if (Math.random() < 0.004) spawnShootingStar();
    requestAnimationFrame(drawCanvas);
  }

  window.addEventListener('resize', () => {
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  });
  initCanvas();
  drawCanvas();

  function spawnSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = pickRandom(['✦', '✧', '⋆', '✶', '·']);
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.color = pickRandom(['#7C6FEB', '#6BC5A0', '#F5A86C', '#FFD166', '#fff']);
    sparkle.style.fontSize = (Math.random() * 10 + 8) + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4000);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood-card, .login-btn, .dash-card, .quick-prompt-btn, .sound-pill, .sidebar-btn, .header-btn, .header-action-btn');
    if (btn) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          spawnSparkle(e.clientX + (Math.random() - 0.5) * 40, e.clientY + (Math.random() - 0.5) * 25);
        }, i * 70);
      }
    }
  });

  /* ═══════════════════════════════════════════
     7. WEB AUDIO PROCEDURAL SYNTHESIZER & SOUNDSCAPES
     ═══════════════════════════════════════════ */
  let audioCtx = null;
  let masterGain = null;
  const activeSoundNodes = {};

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(state.soundVolume, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function stopTrack(type) {
    if (activeSoundNodes[type]) {
      activeSoundNodes[type].forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (err) {}
      });
      delete activeSoundNodes[type];
    }
  }

  function stopAllSounds() {
    Object.keys(activeSoundNodes).forEach((t) => stopTrack(t));
    state.currentSound = 'off';
    $$('.sound-pill').forEach((p) => p.classList.toggle('active', p.dataset.sound === 'off'));
    if ($('#dashSoundName')) $('#dashSoundName').textContent = 'Off (Silence)';
    if ($('#dashSoundIcon')) $('#dashSoundIcon').textContent = '🔇';
    if ($('#headerSoundBtn')) $('#headerSoundBtn').classList.remove('sound-active');
  }

  function playTibetanBowlChime() {
    initAudioContext();
    if (!audioCtx) return;

    const partials = [
      { freq: 278, gain: 0.28, decay: 4.5 },
      { freq: 556, gain: 0.18, decay: 3.8 },
      { freq: 780, gain: 0.08, decay: 2.5 },
      { freq: 1112, gain: 0.04, decay: 1.8 },
    ];

    partials.forEach((p) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(p.gain, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + p.decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      osc.stop(audioCtx.currentTime + p.decay + 0.1);
    });
  }

  function startTrack(type, customVol = null) {
    initAudioContext();
    if (!audioCtx) return;
    stopTrack(type);

    const trackGain = audioCtx.createGain();
    const vol = customVol !== null ? customVol : (state.mixerVolumes[type] || 0.6);
    trackGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    trackGain.connect(masterGain);

    const nodes = [trackGain];

    if (type === 'rain') {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0=0,b1=0,b2=0,b3=0;
      for (let i=0; i<bufferSize; i++) {
        const white = Math.random()*2 - 1;
        b0 = 0.99886*b0 + white*0.0555; b1 = 0.99332*b1 + white*0.075;
        b2 = 0.969*b2 + white*0.153; b3 = 0.8665*b3 + white*0.31;
        output[i] = (b0+b1+b2+b3+white*0.5)*0.11;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      noise.connect(filter);
      filter.connect(trackGain);
      noise.start();
      nodes.push(noise, filter);
    } else if (type === 'ocean') {
      const bufferSize = audioCtx.sampleRate * 3;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i=0; i<bufferSize; i++) output[i] = (Math.random()*2 - 1)*0.15;
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      noise.connect(filter);
      filter.connect(trackGain);
      noise.start();
      lfo.start();
      nodes.push(noise, filter, lfo, lfoGain);
    } else if (type === 'drone') {
      [108, 216, 432, 648].forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = idx%2===0 ? 'sine':'triangle';
        osc.frequency.value = f;
        g.gain.value = 0.08 / (idx+1);
        osc.connect(g);
        g.connect(trackGain);
        osc.start();
        nodes.push(osc, g);
      });
    } else if (type === 'breeze') {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i=0; i<bufferSize; i++) output[i] = (Math.random()*2 - 1)*0.12;
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.2;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.2;
      const lfoG = audioCtx.createGain();
      lfoG.gain.value = 200;
      lfo.connect(lfoG);
      lfoG.connect(filter.frequency);
      noise.connect(filter);
      filter.connect(trackGain);
      noise.start();
      lfo.start();
      nodes.push(noise, filter, lfo, lfoG);
    } else if (type === 'brown') {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i=0; i<bufferSize; i++) {
        const white = Math.random()*2 - 1;
        output[i] = (lastOut + (0.02*white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      const brown = audioCtx.createBufferSource();
      brown.buffer = noiseBuffer;
      brown.loop = true;
      brown.connect(trackGain);
      brown.start();
      nodes.push(brown);
    } else if (type === 'fire') {
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i=0; i<bufferSize; i++) {
        const isCrackle = Math.random() < 0.001;
        output[i] = isCrackle ? (Math.random()*2 - 1)*0.8 : (Math.random()*2 - 1)*0.02;
      }
      const fire = audioCtx.createBufferSource();
      fire.buffer = noiseBuffer;
      fire.loop = true;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800;
      fire.connect(filter);
      filter.connect(trackGain);
      fire.start();
      nodes.push(fire, filter);
    }

    activeSoundNodes[type] = nodes;
  }

  function playSoloSoundscape(type) {
    if (type === 'off') {
      stopAllSounds();
      showToast('🔇 Soundscape silenced');
      return;
    }
    stopAllSounds();
    state.currentSound = type;
    startTrack(type, 0.7);

    $$('.sound-pill').forEach((p) => p.classList.toggle('active', p.dataset.sound === type));
    const soundNames = {
      rain: 'Gentle Rain 🌧️', ocean: 'Ocean Surf 🌊', drone: '432Hz Drone ✨',
      breeze: 'Forest Breeze 🍃', brown: 'Brown Noise 🎧', fire: 'Campfire 🔥',
    };
    const soundIcons = { rain: '🌧️', ocean: '🌊', drone: '✨', breeze: '🍃', brown: '🎧', fire: '🔥' };
    if ($('#dashSoundName')) $('#dashSoundName').textContent = soundNames[type] || 'Active';
    if ($('#dashSoundIcon')) $('#dashSoundIcon').textContent = soundIcons[type] || '🎵';
    if ($('#headerSoundBtn')) $('#headerSoundBtn').classList.add('sound-active');
    showToast(`🎵 Playing ${soundNames[type]}`);
  }

  /* ═══════════════════════════════════════════
     8. GRATITUDE & JOY JAR
     ═══════════════════════════════════════════ */
  function openGratitudeModal() {
    renderGratitudeJarStars();
    if ($('#drawnMemoryCard')) $('#drawnMemoryCard').style.display = 'none';
    if (gratitudeModal) gratitudeModal.classList.add('active');
  }

  function closeGratitudeModal() {
    if (gratitudeModal) gratitudeModal.classList.remove('active');
  }

  function getGratitudes() {
    return JSON.parse(localStorage.getItem('aetheria_gratitudes') || '[]');
  }

  function saveGratitude(text) {
    if (!text.trim()) return;
    const list = getGratitudes();
    list.unshift({ text: text.trim(), date: new Date().toISOString() });
    localStorage.setItem('aetheria_gratitudes', JSON.stringify(list));
    renderGratitudeJarStars();
    renderGratitudeJarCount();
    showToast('✨ Gratitude star added to your jar!');
  }

  function renderGratitudeJarStars() {
    const list = getGratitudes();
    const container = $('#jarStarsContainer');
    if (!container) return;
    container.innerHTML = list.slice(0, 24).map(() => `<span class="jar-star">⭐</span>`).join('');
  }

  function renderGratitudeJarCount() {
    const list = getGratitudes();
    if ($('#gratitudeCountDesc')) {
      $('#gratitudeCountDesc').textContent = `${list.length} joy star${list.length === 1 ? '' : 's'} inside. Tap to draw a memory.`;
    }
  }

  /* ═══════════════════════════════════════════
     9. ZEN MEDITATION TIMER
     ═══════════════════════════════════════════ */
  function openMeditationModal() {
    resetMeditationTimer();
    if (meditationModal) meditationModal.classList.add('active');
  }

  function closeMeditationModal() {
    clearInterval(state.meditationTimer);
    state.isMeditating = false;
    if (meditationModal) meditationModal.classList.remove('active');
  }

  function resetMeditationTimer() {
    clearInterval(state.meditationTimer);
    state.isMeditating = false;
    state.meditationTotalSecs = state.meditationMinutes * 60;
    state.meditationRemainingSecs = state.meditationTotalSecs;
    updateMeditationDisplay();
    if ($('#meditationStartBtn')) $('#meditationStartBtn').textContent = '▶ Start Meditation';
  }

  function updateMeditationDisplay() {
    const mins = Math.floor(state.meditationRemainingSecs / 60);
    const secs = state.meditationRemainingSecs % 60;
    if ($('#meditationTimeText')) {
      $('#meditationTimeText').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    const progress = $('#meditationRingProgress');
    if (progress) {
      const frac = (state.meditationTotalSecs - state.meditationRemainingSecs) / state.meditationTotalSecs;
      progress.style.strokeDashoffset = 440 * (1 - frac);
    }
  }

  /* ═══════════════════════════════════════════
     10. ZEN SANCTUARY & COMFORT VAULT
     ═══════════════════════════════════════════ */
  function openZenSanctuary() {
    if (zenSanctuaryOverlay) zenSanctuaryOverlay.classList.add('active');
    if ($('#zenWisdomText')) $('#zenWisdomText').textContent = pickRandom(ZEN_QUOTES);
    if (Object.keys(activeSoundNodes).length === 0) {
      playSoloSoundscape('drone');
    }
  }

  function closeZenSanctuary() {
    if (zenSanctuaryOverlay) zenSanctuaryOverlay.classList.remove('active');
  }

  function getVaultItems() {
    return JSON.parse(localStorage.getItem('aetheria_vault') || '[]');
  }

  function saveToVault(text) {
    const items = getVaultItems();
    if (!items.some((i) => i.text === text)) {
      items.unshift({ text, date: new Date().toISOString() });
      localStorage.setItem('aetheria_vault', JSON.stringify(items));
      showToast('⭐ Message saved to your Comfort Vault!');
    } else {
      showToast('✨ Already saved in your Comfort Vault');
    }
    renderVaultCount();
  }

  function removeFromVault(text) {
    let items = getVaultItems();
    items = items.filter((i) => i.text !== text);
    localStorage.setItem('aetheria_vault', JSON.stringify(items));
    renderComfortVault();
    renderVaultCount();
    showToast('Removed from Comfort Vault');
  }

  function renderComfortVault() {
    const items = getVaultItems();
    const container = $('#vaultItemsList');
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">No saved comfort messages yet. Star (⭐) messages in chat to keep them here!</p>';
      return;
    }
    container.innerHTML = items.map((item) => {
      const d = new Date(item.date);
      return `
        <div class="vault-card">
          <div class="vault-card-header">
            <span class="vault-date">${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <button class="vault-delete-btn" data-text="${encodeURIComponent(item.text)}" type="button" title="Remove note">✕</button>
          </div>
          <p class="vault-text">${formatMessage(item.text)}</p>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.vault-delete-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeFromVault(decodeURIComponent(btn.dataset.text));
      });
    });
  }

  function renderVaultCount() {
    const items = getVaultItems();
    if ($('#vaultCountDesc')) {
      $('#vaultCountDesc').textContent = `${items.length} starred comforting reminder${items.length === 1 ? '' : 's'}.`;
    }
  }

  function openComfortVault() {
    renderComfortVault();
    if (comfortVaultModal) comfortVaultModal.classList.add('active');
  }

  /* ═══════════════════════════════════════════
     11. DAILY SELF-CARE QUESTS
     ═══════════════════════════════════════════ */
  function getQuestData() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('aetheria_quests') || '{}');
    if (stored.date !== today) {
      let streak = parseInt(localStorage.getItem('aetheria_quest_streak') || '1', 10);
      return { date: today, completed: [], streak };
    }
    return stored;
  }

  function saveQuestData(data) {
    localStorage.setItem('aetheria_quests', JSON.stringify(data));
    localStorage.setItem('aetheria_quest_streak', data.streak || 1);
  }

  function renderQuests() {
    const container = $('#questList');
    if (!container) return;
    const data = getQuestData();
    if ($('#questStreakCount')) $('#questStreakCount').textContent = `${data.streak || 1} Day${(data.streak || 1) === 1 ? '' : 's'}`;

    container.innerHTML = DEFAULT_QUESTS.map((q) => {
      const isDone = data.completed.includes(q.id);
      return `
        <div class="quest-item ${isDone ? 'completed' : ''}" data-id="${q.id}">
          <div class="quest-checkbox">${isDone ? '✓' : ''}</div>
          <span class="quest-text">${q.text}</span>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.quest-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const currentData = getQuestData();
        if (currentData.completed.includes(id)) {
          currentData.completed = currentData.completed.filter((x) => x !== id);
        } else {
          currentData.completed.push(id);
          showToast('🌱 Quest checked! Take care of yourself.');
          if (currentData.completed.length === DEFAULT_QUESTS.length) {
            currentData.streak = (currentData.streak || 1) + 1;
            playTibetanBowlChime();
            showToast('🎉 All Daily Quests Complete! You did wonderfully today.');
          }
        }
        saveQuestData(currentData);
        renderQuests();
      });
    });
  }

  /* ═══════════════════════════════════════════
     12. CHAT ENGINE & STARRED CONVERSATIONS
     ═══════════════════════════════════════════ */
  function startConversation() {
    state.chatHistory = [];
    state.messageCount = 0;
    if (messagesContainer) messagesContainer.innerHTML = '';
    if (quickPrompts) quickPrompts.classList.remove('hidden');
    const cfg = MOODS[state.currentMood] || MOODS.happy;
    addMessage('ai', cfg.greeting);
  }

  function addMessage(role, text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatar = role === 'ai' ? '✨' : '🫧';

    div.innerHTML = `
      <div class="msg-avatar">${avatar}</div>
      <div class="msg-content">
        <div class="msg-bubble">${formatMessage(text)}</div>
        <div class="msg-meta">
          <span class="msg-time">${time}</span>
          ${role === 'ai' ? `<button class="msg-star-btn" type="button" title="Save to Comfort Vault">⭐</button>` : ''}
        </div>
      </div>
    `;

    if (role === 'ai') {
      const starBtn = div.querySelector('.msg-star-btn');
      starBtn?.addEventListener('click', () => {
        starBtn.classList.add('starred');
        saveToVault(text);
      });
    }

    if (messagesContainer) messagesContainer.appendChild(div);
    scrollToBottom();
    state.chatHistory.push({ role: role === 'ai' ? 'model' : 'user', parts: [{ text }] });

    if (role === 'ai' && typeof speakText === 'function') speakText(text);
  }

  function scrollToBottom() {
    if (!messagesContainer) return;
    setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 50);
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || state.isTyping) return;
    chatInput.value = '';
    if (quickPrompts) quickPrompts.classList.add('hidden');
    addMessage('user', text);
    state.isTyping = true;
    state.messageCount++;
    if (typingIndicator) typingIndicator.classList.add('active');
    scrollToBottom();

    try {
      let res;
      if (state.apiKey) {
        res = await callGeminiAPI(text);
      } else {
        res = await getLocalResponse(text);
      }
      if (typingIndicator) typingIndicator.classList.remove('active');
      state.isTyping = false;
      addMessage('ai', res);
    } catch (err) {
      if (typingIndicator) typingIndicator.classList.remove('active');
      state.isTyping = false;
      const cleanErrMsg = CryptoSecurity.scrubErrors(err.message || 'Error generating response');
      console.warn('AI Response fallback:', cleanErrMsg);
      const fallback = await getLocalResponse(text);
      addMessage('ai', fallback);
    }
  }

  function getLocalResponse(userMessage) {
    return new Promise((resolve) => {
      const delay = 600 + Math.random() * 900;
      setTimeout(() => {
        const mood = state.currentMood || 'fallback';
        const pool = LOCAL_RESPONSES[mood] || LOCAL_RESPONSES.fallback;
        const msg = userMessage.toLowerCase();

        if (msg.includes('thank') || msg.includes('thanks')) {
          resolve(pickRandom([
            `You're so welcome, ${state.userName}. I'm always here for you. 💜`,
            "Anytime! That's what I'm here for. How are you feeling now?",
            "No need to thank me — you deserve to be heard. 🤍",
          ]));
        } else if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
          resolve(pickRandom([
            `Take care, ${state.userName}. Remember, I'm always just a message away. 💫`,
            "Goodbye for now! Be kind to yourself today. You deserve it. 🌸",
            "See you soon! Remember — you're not alone in this. 🤍",
          ]));
        } else if (msg.includes('help') || msg.includes('crisis') || msg.includes('suicide') || msg.includes('hurt myself')) {
          resolve("I care about you deeply. If you're in crisis, please reach out to a professional: National Suicide Prevention Lifeline — 988 (call or text). You matter, and help is always available. 💜");
        } else if (msg.includes('breathe') || msg.includes('breathing')) {
          resolve("Let's try a breathing exercise! Click the 🫁 button in the header. Our 4-4-4, 4-7-8, or Physiological Sigh techniques are wonderful for soothing tension. 🌿");
        } else if (msg.includes('ground') || msg.includes('panic') || msg.includes('overwhelm')) {
          resolve("If things feel too intense, try our 5-4-3-2-1 Sensory Grounding tool (click 🌿 in the sidebar). It pulls your senses gently back to safety.");
        } else if (msg.includes('who are you') || msg.includes('what are you')) {
          resolve(`I'm Aetheria, your emotional wellness companion ✨. I'm here to listen, support, and walk alongside you — no judgment, just warmth.`);
        } else {
          resolve(pool[state.messageCount % pool.length]);
        }
      }, delay);
    });
  }

  async function callGeminiAPI(userMessage) {
    const rateCheck = RateLimiter.canRequest();
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.reason);
    }
    RateLimiter.recordRequest();

    const cfg = MOODS[state.currentMood] || MOODS.happy;
    const persona = PERSONAS[state.currentPersona] || PERSONAS.friend;
    const sysText = `${persona.systemPrompt}\n\nThe user's name is ${state.userName}.\n${cfg.prompt}\nRespond naturally in 2-4 concise, supportive sentences.`;

    const body = {
      system_instruction: { parts: [{ text: sysText }] },
      contents: state.chatHistory.map((m) => ({ role: m.role, parts: m.parts })),
      generationConfig: { temperature: 0.85, topP: 0.92, topK: 40, maxOutputTokens: 350 },
    };

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': state.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      const rawMsg = e.error?.message || res.statusText || res.status;
      throw new Error(CryptoSecurity.scrubErrors(String(rawMsg)));
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response returned from model');
    return text.trim();
  }

  /* ═══════════════════════════════════════════
     13. BREATHING GYM & SENSORY GROUNDING
     ═══════════════════════════════════════════ */
  let breatheRunning = false;

  function openBreathe() { if (breatheOverlay) breatheOverlay.classList.add('active'); }
  function closeBreathe() {
    breatheRunning = false;
    clearTimeout(state.breatheInterval);
    if (breatheCircle) {
      breatheCircle.className = 'breathe-circle';
      breatheCircle.textContent = 'Ready';
    }
    if (breatheLabel) breatheLabel.textContent = 'Press start to begin';
    if ($('#breatheStartBtn')) $('#breatheStartBtn').style.display = '';
    if (breatheOverlay) breatheOverlay.classList.remove('active');
  }

  function startBreathe() {
    breatheRunning = true;
    if ($('#breatheStartBtn')) $('#breatheStartBtn').style.display = 'none';

    let phase = 0;
    let phases = [];

    if (state.breatheTechnique === 'box') {
      phases = [
        { label: 'Breathe in slowly...', cls: 'inhale', text: 'Inhale', ms: 4000 },
        { label: 'Hold your breath gently...', cls: 'inhale', text: 'Hold', ms: 4000 },
        { label: 'Slowly release all air...', cls: 'exhale', text: 'Exhale', ms: 4000 },
        { label: 'Hold empty and relax...', cls: 'exhale', text: 'Hold', ms: 4000 },
      ];
    } else if (state.breatheTechnique === '478') {
      phases = [
        { label: 'Inhale through nose...', cls: 'inhale', text: 'Inhale (4s)', ms: 4000 },
        { label: 'Hold comfortably...', cls: 'inhale', text: 'Hold (7s)', ms: 7000 },
        { label: 'Whoosh exhale completely...', cls: 'exhale', text: 'Exhale (8s)', ms: 8000 },
      ];
    } else if (state.breatheTechnique === 'sigh') {
      phases = [
        { label: 'Inhale deep...', cls: 'inhale', text: 'Inhale 1', ms: 2000 },
        { label: 'Top it off with another quick sip...', cls: 'inhale', text: 'Inhale 2', ms: 1500 },
        { label: 'Long slow sigh out through mouth...', cls: 'exhale', text: 'Long Sigh', ms: 6000 },
      ];
    }

    function next() {
      if (!breatheRunning) return;
      const p = phases[phase % phases.length];
      if (breatheCircle) {
        breatheCircle.className = 'breathe-circle ' + p.cls;
        breatheCircle.textContent = p.text;
      }
      if (breatheLabel) breatheLabel.textContent = p.label;
      phase++;
      state.breatheInterval = setTimeout(next, p.ms);
    }
    next();
  }

  function openGrounding() {
    state.groundingStep = 5;
    renderGroundingStep();
    if (groundingOverlay) groundingOverlay.classList.add('active');
  }

  function closeGrounding() { if (groundingOverlay) groundingOverlay.classList.remove('active'); }

  function renderGroundingStep() {
    const step = state.groundingStep;
    const data = GROUNDING_STEPS[step];

    $$('.step-dot').forEach((dot) => {
      const s = parseInt(dot.dataset.step, 10);
      dot.classList.toggle('active', s === step);
      dot.classList.toggle('completed', s > step);
    });

    if ($('#groundingIcon')) $('#groundingIcon').textContent = data.icon;
    if ($('#groundingStepTitle')) $('#groundingStepTitle').textContent = data.title;
    if ($('#groundingInstruction')) $('#groundingInstruction').textContent = data.instruction;

    const container = $('#groundingInputsContainer');
    if (container) {
      container.innerHTML = data.placeholders.map((ph, idx) => `
        <input type="text" class="grounding-input" placeholder="${ph}" aria-label="Grounding observation ${idx + 1}" />
      `).join('');
    }

    if ($('#groundingPrevBtn')) $('#groundingPrevBtn').style.display = step < 5 ? 'block' : 'none';
    if ($('#groundingNextBtn')) $('#groundingNextBtn').textContent = step === 1 ? 'Complete Grounding ✨' : 'Next Step →';
  }

  /* ═══════════════════════════════════════════
     14. JOURNAL & 7-DAY MOOD ANALYTICS
     ═══════════════════════════════════════════ */
  function saveMoodToJournal(mood, note = '') {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    j.unshift({
      mood,
      emoji: MOODS[mood]?.emoji || '✨',
      label: MOODS[mood]?.label || 'Moment',
      score: MOODS[mood]?.score || 3,
      note: note,
      date: new Date().toISOString(),
    });
    if (j.length > 50) j.length = 50;
    localStorage.setItem('aetheria_journal', JSON.stringify(j));
    renderMoodStats();
    renderJournalPreview();
    renderMoodChart();
  }

  function saveJournalNote(noteText) {
    if (!noteText) return;
    saveMoodToJournal(state.currentMood || 'happy', noteText);
  }

  function renderJournalPreview() {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    if (!journalPreview) return;
    if (!j.length) {
      journalPreview.innerHTML = '<p style="font-size:.8rem;color:var(--text-muted);padding:10px 0;">No entries yet. Share your mood or write a reflection above!</p>';
      return;
    }
    journalPreview.innerHTML = j.slice(0, 8).map((e) => {
      const d = new Date(e.date);
      return `
        <div class="jp-entry">
          <span class="jp-emoji">${e.emoji}</span>
          <div class="jp-content">
            <span class="jp-text">${e.label}</span>
            ${e.note ? `<span class="jp-note">"${formatMessage(e.note)}"</span>` : ''}
          </div>
          <span class="jp-date">${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `;
    }).join('');
  }

  function renderMoodStats() {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    if (!moodStats) return;
    const counts = {};
    j.forEach((e) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (!sorted.length) {
      moodStats.innerHTML = '<p style="font-size:.8rem;color:var(--text-muted)">No mood logs yet</p>';
      return;
    }
    moodStats.innerHTML = sorted.map(([m, c]) => `
      <div class="stat-pill">
        <span class="pill-emoji">${MOODS[m]?.emoji || '❓'}</span>
        <span class="pill-count">${c}</span>
      </div>
    `).join('');
  }

  function renderMoodChart() {
    const svg = $('#moodTrendSvg');
    if (!svg) return;
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');

    if (!j.length) {
      svg.innerHTML = `<text x="350" y="85" class="chart-empty-text">Check in with your mood to see your 7-day emotional flow ✨</text>`;
      return;
    }

    const pointsData = j.slice(0, 7).reverse();
    const width = 700;
    const height = 140;
    const padX = 40;
    const padY = 25;

    const stepX = (width - padX * 2) / Math.max(pointsData.length - 1, 1);
    const coords = pointsData.map((pt, i) => {
      const x = padX + i * stepX;
      const score = pt.score || 3;
      const y = height - padY - ((score - 1) / 4) * (height - padY * 2);
      return { x, y, pt };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7C6FEB" />
          <stop offset="50%" stop-color="#4ECDC4" />
          <stop offset="100%" stop-color="#FFD93D" />
        </linearGradient>
        <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7C6FEB" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#7C6FEB" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <line x1="${padX}" y1="${height / 2}" x2="${width - padX}" y2="${height / 2}" class="chart-axis-line" />
      <path d="${areaD}" class="chart-area-fill" />
      <path d="${pathD}" class="chart-line" />

      ${coords.map((c) => {
        const d = new Date(c.pt.date);
        const day = d.toLocaleDateString([], { weekday: 'short' });
        return `
          <g>
            <circle cx="${c.x}" cy="${c.y}" class="chart-dot">
              <title>${c.pt.emoji} ${c.pt.label} (${day})</title>
            </circle>
            <text x="${c.x}" y="${height - 4}" class="chart-label">${c.pt.emoji} ${day}</text>
          </g>
        `;
      }).join('')}
    `;
  }

  /* ═══════════════════════════════════════════
     15. PERSONA & API KEY MODAL CONTROLLERS
     ═══════════════════════════════════════════ */
  function openPersonaModal() {
    if (personaModal) personaModal.classList.add('active');
    $$('.persona-card').forEach((card) => {
      const p = card.dataset.persona;
      const isActive = p === state.currentPersona;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-checked', isActive);
    });
  }

  function closePersonaModal() { if (personaModal) personaModal.classList.remove('active'); }

  function updatePersonaDisplay() {
    const p = PERSONAS[state.currentPersona] || PERSONAS.friend;
    if ($('#currentPersonaDesc')) $('#currentPersonaDesc').textContent = p.desc;
    if ($('#chatSubtext')) $('#chatSubtext').textContent = p.subtext;
  }

  function openApiKeyModal() {
    if (apiKeyModal) apiKeyModal.classList.add('active');
    updateApiKeyUI();
    if (apiKeyInput) apiKeyInput.focus();
  }

  function closeApiKeyModal() {
    if (apiKeyModal) apiKeyModal.classList.remove('active');
  }

  function updateApiKeyUI() {
    if (state.apiKey) {
      if (apiKeyStatus) {
        apiKeyStatus.textContent = `🟢 Connected & Encrypted: ${CryptoSecurity.maskKey(state.apiKey)}`;
        apiKeyStatus.style.display = 'block';
      }
      if (apiKeyDisconnectBtn) apiKeyDisconnectBtn.style.display = 'block';
      if (apiKeyInput) apiKeyInput.placeholder = 'Key connected (paste new key to update)';
    } else {
      if (apiKeyStatus) apiKeyStatus.style.display = 'none';
      if (apiKeyDisconnectBtn) apiKeyDisconnectBtn.style.display = 'none';
      if (apiKeyInput) apiKeyInput.placeholder = 'Paste your Gemini API key (AIzaSy...)';
    }
  }

  async function initStoredApiKey() {
    const legacyKey = localStorage.getItem('aetheria_api_key');
    if (legacyKey) {
      if (CryptoSecurity.validateGeminiKey(legacyKey)) {
        const enc = await CryptoSecurity.encrypt(legacyKey);
        localStorage.setItem('aetheria_api_key_enc', JSON.stringify(enc));
      }
      localStorage.removeItem('aetheria_api_key');
    }

    const storedEnc = localStorage.getItem('aetheria_api_key_enc');
    if (storedEnc) {
      try {
        const parsed = JSON.parse(storedEnc);
        state.apiKey = await CryptoSecurity.decrypt(parsed);
        updateApiKeyUI();
      } catch (e) {}
    }
  }

  /* ═══════════════════════════════════════════
     16. COMMAND PALETTE (Ctrl+K)
     ═══════════════════════════════════════════ */
  const COMMANDS = [
    { title: 'Start a Conversation', category: 'Chat', icon: '💬', action: () => { showScreen(moodScreen); } },
    { title: '4-4-4 Box Breathing', category: 'Mindfulness', icon: '🫁', action: () => { state.breatheTechnique = 'box'; openBreathe(); } },
    { title: '4-7-8 Deep Sleep Breathing', category: 'Mindfulness', icon: '🌙', action: () => { state.breatheTechnique = '478'; openBreathe(); } },
    { title: 'Physiological Sigh (De-stress)', category: 'Mindfulness', icon: '😮‍💨', action: () => { state.breatheTechnique = 'sigh'; openBreathe(); } },
    { title: '5-4-3-2-1 Sensory Grounding', category: 'Mindfulness', icon: '🌿', action: openGrounding },
    { title: 'Zen Meditation Timer (Tibetan Bowl)', category: 'Mindfulness', icon: '🔔', action: openMeditationModal },
    { title: 'Gratitude & Joy Jar', category: 'Mindfulness', icon: '🏺', action: openGratitudeModal },
    { title: 'Open Comfort Vault', category: 'Vault', icon: '⭐', action: openComfortVault },
    { title: 'Enter Zen Sanctuary (Fullscreen)', category: 'Sanctuary', icon: '🌌', action: openZenSanctuary },
    { title: 'Open Soundscape Multi-Mixer', category: 'Audio', icon: '🎛️', action: () => soundMixerModal?.classList.add('active') },
    { title: 'Soundscape: Gentle Rain', category: 'Audio', icon: '🌧️', action: () => playSoloSoundscape('rain') },
    { title: 'Soundscape: Ocean Waves', category: 'Audio', icon: '🌊', action: () => playSoloSoundscape('ocean') },
    { title: 'Soundscape: 432Hz Drone', category: 'Audio', icon: '✨', action: () => playSoloSoundscape('drone') },
    { title: 'Soundscape: Forest Breeze', category: 'Audio', icon: '🍃', action: () => playSoloSoundscape('breeze') },
    { title: 'Soundscape: Brown Noise', category: 'Audio', icon: '🎧', action: () => playSoloSoundscape('brown') },
    { title: 'Soundscape: Campfire Crackle', category: 'Audio', icon: '🔥', action: () => playSoloSoundscape('fire') },
    { title: 'Mute All Sounds', category: 'Audio', icon: '🔇', action: stopAllSounds },
    { title: 'Change Companion Tone', category: 'Personality', icon: '🎭', action: openPersonaModal },
    { title: 'Toggle Light / Dark Theme', category: 'Preferences', icon: '🌓', action: () => $('#themeToggleBtn')?.click() },
    { title: 'Toggle Spoken Responses (Voice)', category: 'Preferences', icon: '🔊', action: () => $('#voiceToggleBtn')?.click() },
    { title: 'Change Your Name / Profile', category: 'Profile', icon: '👤', action: () => { showScreen(loginScreen); if (nameInput) { nameInput.value = state.userName; nameInput.focus(); } } },
    { title: 'Go to Dashboard', category: 'Navigation', icon: '📊', action: goToDashboard },
    { title: 'Secure API Key Settings', category: 'Security', icon: '🔒', action: openApiKeyModal },
  ];

  function openCommandPalette() {
    if (commandPalette) commandPalette.classList.add('active');
    const input = $('#paletteInput');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderPaletteResults('');
  }

  function closeCommandPalette() {
    if (commandPalette) commandPalette.classList.remove('active');
  }

  function renderPaletteResults(query) {
    const q = query.toLowerCase().trim();
    const results = COMMANDS.filter((cmd) => cmd.title.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q));
    const container = $('#paletteResults');
    if (!container) return;

    if (!results.length) {
      container.innerHTML = '<p style="padding:16px;text-align:center;color:var(--text-muted);font-size:.85rem;">No matching commands found.</p>';
      return;
    }

    container.innerHTML = results.map((cmd, i) => `
      <div class="palette-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
        <div class="palette-item-left">
          <span class="palette-item-icon">${cmd.icon}</span>
          <span class="palette-item-text">${cmd.title}</span>
        </div>
        <span class="palette-item-badge">${cmd.category}</span>
      </div>
    `).join('');

    container.querySelectorAll('.palette-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        closeCommandPalette();
        results[idx]?.action();
      });
    });
  }

  /* ═══════════════════════════════════════════
     17. SPEECH & VOICE RECOGNITION
     ═══════════════════════════════════════════ */
  const micBtn = $('#micBtn');
  const voiceToggleBtn = $('#voiceToggleBtn');
  let voiceEnabled = localStorage.getItem('aetheria_voice') === 'true';
  let isRecording = false;

  if (voiceEnabled && voiceToggleBtn) {
    voiceToggleBtn.classList.add('voice-active');
    voiceToggleBtn.textContent = '🔊';
  }

  function speakText(text) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find((v) => v.lang.startsWith('en') && v.name.includes('Female'))
      || voices.find((v) => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (micBtn) micBtn.style.display = 'none';
      return null;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      isRecording = true;
      micBtn.classList.add('recording');
      micBtn.textContent = '⏹';
      if (chatInput) chatInput.placeholder = '🎙 Listening...';
    };

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (chatInput) chatInput.value = transcript;
    };

    rec.onend = () => {
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎤';
      if (chatInput) {
        chatInput.placeholder = "Share what's on your mind...";
        if (chatInput.value.trim()) sendMessage();
      }
    };

    rec.onerror = (event) => {
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎤';
      if (chatInput) chatInput.placeholder = "Share what's on your mind...";
      if (event.error === 'not-allowed') {
        showToast('🎤 Microphone access denied.');
      } else if (event.error !== 'aborted') {
        showToast('🎤 Voice input error. Try again.');
      }
    };
    return rec;
  }

  const recognition = initSpeechRecognition();

  /* ═══════════════════════════════════════════
     18. ATTACH ALL EVENT LISTENERS
     ═══════════════════════════════════════════ */
  // Login & Profile Actions
  loginBtn?.addEventListener('click', handleLogin);
  nameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleLogin(); });

  $('#logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('aetheria_user');
    state.userName = '';
    if (nameInput) nameInput.value = '';
    stopAllSounds();
    showScreen(loginScreen);
    if (nameInput) nameInput.focus();
    showToast('Signed out successfully');
  });

  $('#editNameBtn')?.addEventListener('click', () => {
    showScreen(loginScreen);
    if (nameInput) {
      nameInput.value = state.userName;
      nameInput.focus();
    }
    showToast('✏️ Change your name and press Enter to save');
  });

  // Mood Selection
  moodGrid?.addEventListener('click', (e) => {
    const card = e.target.closest('.mood-card');
    if (!card) return;
    const mood = card.dataset.mood;
    state.currentMood = mood;
    state.messageCount = 0;
    const cfg = MOODS[mood];

    document.documentElement.style.setProperty('--mood-color', cfg.color);
    document.documentElement.style.setProperty('--mood-glow', cfg.glow);
    if (currentMoodEmoji) currentMoodEmoji.textContent = cfg.emoji;
    if (currentMoodText) currentMoodText.textContent = cfg.label;
    if ($('#sidebarUser')) $('#sidebarUser').textContent = state.userName;

    saveMoodToJournal(mood);
    card.style.transform = 'scale(.92)';
    setTimeout(() => { card.style.transform = ''; }, 200);

    showChat();
    startConversation();
  });

  // Dashboard Feature Cards
  $('#startChatCard')?.addEventListener('click', () => { showScreen(moodScreen); });
  $('#breatheCard')?.addEventListener('click', openBreathe);
  $('#dashMeditationCard')?.addEventListener('click', openMeditationModal);
  $('#dashGroundingCard')?.addEventListener('click', openGrounding);
  $('#dashGratitudeCard')?.addEventListener('click', openGratitudeModal);
  $('#dashPersonaCard')?.addEventListener('click', openPersonaModal);
  $('#dashVaultCard')?.addEventListener('click', openComfortVault);
  $('#dashZenBtn')?.addEventListener('click', openZenSanctuary);
  $('#zenBtn')?.addEventListener('click', openZenSanctuary);
  $('#moodBackBtn')?.addEventListener('click', () => { goToDashboard(); });

  // API Key Triggers
  $('#dashApiBtn')?.addEventListener('click', openApiKeyModal);
  $('#sidebarApiBtn')?.addEventListener('click', openApiKeyModal);
  $('#headerApiBtn')?.addEventListener('click', openApiKeyModal);
  $('#apiKeyCloseBtn')?.addEventListener('click', closeApiKeyModal);

  apiKeySubmit?.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      if (apiKeyError) {
        apiKeyError.textContent = 'Please enter an API key.';
        apiKeyError.style.display = 'block';
      }
      return;
    }
    if (!CryptoSecurity.validateGeminiKey(key)) {
      if (apiKeyError) {
        apiKeyError.textContent = 'Invalid format. Gemini keys start with "AIzaSy" and are 39 characters.';
        apiKeyError.style.display = 'block';
      }
      return;
    }
    if (apiKeyError) apiKeyError.style.display = 'none';

    try {
      const encrypted = await CryptoSecurity.encrypt(key);
      localStorage.setItem('aetheria_api_key_enc', JSON.stringify(encrypted));
      state.apiKey = key;
      if (apiKeyInput) apiKeyInput.value = '';
      updateApiKeyUI();
      closeApiKeyModal();
      showToast('🔒 Gemini AI Connected & Encrypted via AES-256-GCM!');
      if (state.currentMood) {
        showChat();
        startConversation();
      }
    } catch (err) {
      showToast('Encryption error. Please try again.');
    }
  });

  apiKeyDisconnectBtn?.addEventListener('click', () => {
    localStorage.removeItem('aetheria_api_key_enc');
    localStorage.removeItem('aetheria_api_key');
    state.apiKey = '';
    if (apiKeyInput) apiKeyInput.value = '';
    updateApiKeyUI();
    showToast('🗑️ API key disconnected and purged from device.');
  });

  apiKeyInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') apiKeySubmit?.click(); });
  $('#toggleKeyVis')?.addEventListener('click', () => {
    if (apiKeyInput) {
      apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
    }
  });

  // Soundscape & Mixer Handlers
  const soundVolumeSlider = $('#soundVolumeSlider');
  if (soundVolumeSlider) {
    soundVolumeSlider.value = state.soundVolume;
    soundVolumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      state.soundVolume = vol;
      localStorage.setItem('aetheria_volume', vol);
      if (masterGain && audioCtx) masterGain.gain.setValueAtTime(vol, audioCtx.currentTime);
    });
  }

  $$('.sound-pill').forEach((pill) => {
    pill.addEventListener('click', () => playSoloSoundscape(pill.dataset.sound));
  });

  $('#openMixerBtn')?.addEventListener('click', () => {
    soundMixerModal?.classList.add('active');
    $$('.mixer-track-vol').forEach((inp) => {
      const track = inp.dataset.track;
      inp.value = state.mixerVolumes[track] || 0;
    });
  });

  $('#soundMixerCloseBtn')?.addEventListener('click', () => {
    soundMixerModal?.classList.remove('active');
  });

  $$('.mixer-track-vol').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const track = e.target.dataset.track;
      const vol = parseFloat(e.target.value);
      state.mixerVolumes[track] = vol;
      localStorage.setItem('aetheria_mixer', JSON.stringify(state.mixerVolumes));

      if (vol > 0) {
        startTrack(track, vol);
        if ($('#headerSoundBtn')) $('#headerSoundBtn').classList.add('sound-active');
        if ($('#dashSoundName')) $('#dashSoundName').textContent = 'Custom Layered Mix 🎛️';
      } else {
        stopTrack(track);
      }
    });
  });

  $('#mixerMuteAllBtn')?.addEventListener('click', () => {
    stopAllSounds();
    $$('.mixer-track-vol').forEach((inp) => { inp.value = 0; });
    Object.keys(state.mixerVolumes).forEach((k) => { state.mixerVolumes[k] = 0; });
    localStorage.setItem('aetheria_mixer', JSON.stringify(state.mixerVolumes));
    showToast('🔇 All audio layers muted');
  });

  $('#headerSoundBtn')?.addEventListener('click', () => {
    if (Object.keys(activeSoundNodes).length > 0) {
      stopAllSounds();
    } else {
      playSoloSoundscape('rain');
    }
  });

  $('#sidebarSoundBtn')?.addEventListener('click', () => {
    goToDashboard();
    setTimeout(() => { $('#soundscapeDashBar')?.scrollIntoView({ behavior: 'smooth' }); }, 200);
  });

  // Persona Modal Handlers
  $('#personaBtn')?.addEventListener('click', openPersonaModal);
  $('#personaCloseBtn')?.addEventListener('click', closePersonaModal);

  $$('.persona-card').forEach((card) => {
    card.addEventListener('click', () => {
      $$('.persona-card').forEach((c) => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');
      state.currentPersona = card.dataset.persona;
    });
  });

  $('#personaSubmitBtn')?.addEventListener('click', () => {
    localStorage.setItem('aetheria_persona', state.currentPersona);
    updatePersonaDisplay();
    closePersonaModal();
    const p = PERSONAS[state.currentPersona];
    showToast(`🎭 Companion tone set to ${p.name}`);
  });

  // Gratitude Jar Handlers
  $('#addGratitudeBtn')?.addEventListener('click', () => {
    const inp = $('#gratitudeNoteInput');
    if (!inp || !inp.value.trim()) { showToast('Please enter what you are grateful for'); return; }
    saveGratitude(inp.value);
    inp.value = '';
  });

  $('#drawMemoryBtn')?.addEventListener('click', () => {
    const list = getGratitudes();
    if (!list.length) {
      showToast('Your jar is empty! Add a grateful thought first ✨');
      return;
    }
    const mem = pickRandom(list);
    const card = $('#drawnMemoryCard');
    const d = new Date(mem.date);
    if ($('#drawnMemoryText')) $('#drawnMemoryText').textContent = `"${mem.text}"`;
    if ($('#drawnMemoryDate')) $('#drawnMemoryDate').textContent = `Saved on ${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (card) card.style.display = 'block';
    playTibetanBowlChime();
  });

  $('#gratitudeBtn')?.addEventListener('click', openGratitudeModal);
  $('#gratitudeCloseBtn')?.addEventListener('click', closeGratitudeModal);

  // Meditation Handlers
  $$('.meditation-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      $$('.meditation-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      state.meditationMinutes = parseInt(pill.dataset.minutes, 10);
      resetMeditationTimer();
    });
  });

  $('#meditationStartBtn')?.addEventListener('click', () => {
    if (state.isMeditating) {
      clearInterval(state.meditationTimer);
      state.isMeditating = false;
      if ($('#meditationStartBtn')) $('#meditationStartBtn').textContent = '▶ Resume Meditation';
    } else {
      state.isMeditating = true;
      if ($('#meditationStartBtn')) $('#meditationStartBtn').textContent = '⏸ Pause';
      playTibetanBowlChime();

      state.meditationTimer = setInterval(() => {
        state.meditationRemainingSecs--;
        updateMeditationDisplay();
        if (state.meditationRemainingSecs <= 0) {
          clearInterval(state.meditationTimer);
          state.isMeditating = false;
          playTibetanBowlChime();
          saveJournalNote(`🧘 Completed ${state.meditationMinutes}-Minute Zen Meditation Session`);
          showToast('🔔 Meditation complete. May peace be with you.');
          resetMeditationTimer();
        }
      }, 1000);
    }
  });

  $('#testBowlBtn')?.addEventListener('click', playTibetanBowlChime);
  $('#meditationBtn')?.addEventListener('click', openMeditationModal);
  $('#meditationCloseBtn')?.addEventListener('click', closeMeditationModal);

  // Zen Sanctuary Overlay
  $('#zenExitBtn')?.addEventListener('click', closeZenSanctuary);
  $('#zenNextQuoteBtn')?.addEventListener('click', () => {
    if ($('#zenWisdomText')) $('#zenWisdomText').textContent = pickRandom(ZEN_QUOTES);
    playTibetanBowlChime();
  });

  // Comfort Vault Modal
  $('#vaultBtn')?.addEventListener('click', openComfortVault);
  $('#headerVaultBtn')?.addEventListener('click', openComfortVault);
  $('#comfortVaultCloseBtn')?.addEventListener('click', () => comfortVaultModal?.classList.remove('active'));

  // Breathing Gym Handlers
  $$('.breathe-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.breathe-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.breatheTechnique = tab.dataset.technique;

      if (breatheSublabel) {
        if (state.breatheTechnique === 'box') {
          breatheSublabel.textContent = '4-4-4 Box: Inhale (4s) • Hold (4s) • Exhale (4s) • Hold (4s)';
        } else if (state.breatheTechnique === '478') {
          breatheSublabel.textContent = '4-7-8 Relaxation: Inhale (4s) • Hold (7s) • Exhale (8s)';
        } else if (state.breatheTechnique === 'sigh') {
          breatheSublabel.textContent = 'Physiological Sigh: Double Inhale (2s + 1.5s) • Long Exhale (6s)';
        }
      }

      if (breatheRunning) {
        clearTimeout(state.breatheInterval);
        startBreathe();
      }
    });
  });

  $('#breatheStartBtn')?.addEventListener('click', startBreathe);
  $('#breatheCloseBtn')?.addEventListener('click', closeBreathe);
  $('#breatheBtn')?.addEventListener('click', openBreathe);
  $('#headerBreatheBtn')?.addEventListener('click', openBreathe);

  // 5-4-3-2-1 Grounding Handlers
  $('#groundingBtn')?.addEventListener('click', openGrounding);
  $('#groundingCloseBtn')?.addEventListener('click', closeGrounding);

  $('#groundingPrevBtn')?.addEventListener('click', () => {
    if (state.groundingStep < 5) {
      state.groundingStep++;
      renderGroundingStep();
    }
  });

  $('#groundingNextBtn')?.addEventListener('click', () => {
    if (state.groundingStep > 1) {
      state.groundingStep--;
      renderGroundingStep();
    } else {
      closeGrounding();
      saveJournalNote('🌿 Completed 5-4-3-2-1 Sensory Grounding Session');
      showToast('✨ Grounding Complete. You are safe, present, and centered.');
    }
  });

  // Journal Actions
  $('#saveNoteBtn')?.addEventListener('click', () => {
    const input = $('#quickNoteInput');
    const text = input ? input.value.trim() : '';
    if (!text) { showToast('Please enter a note to save'); return; }
    saveJournalNote(text);
    input.value = '';
    showToast('✍️ Reflection note saved to journal!');
  });

  $('#quickNoteInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('#saveNoteBtn')?.click();
  });

  $('#exportMdBtn')?.addEventListener('click', () => {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    if (!j.length) { showToast('No journal data to export.'); return; }
    let md = `# ✨ Aetheria Journal Export\n*Exported for ${state.userName} on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    j.forEach((e) => {
      const d = new Date(e.date);
      md += `### ${e.emoji} ${e.label} — ${d.toLocaleDateString()} ${d.toLocaleTimeString()}\n`;
      if (e.note) md += `> ${e.note}\n\n`;
      md += `\n`;
    });
    downloadBlob(md, `aetheria_journal_${Date.now()}.md`, 'text/markdown');
    showToast('📄 Exported Markdown Journal!');
  });

  $('#exportJsonBtn')?.addEventListener('click', () => {
    const j = localStorage.getItem('aetheria_journal') || '[]';
    downloadBlob(j, `aetheria_journal_${Date.now()}.json`, 'application/json');
    showToast('💾 Exported JSON Journal!');
  });

  $('#clearDataBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your local journal and mood history?')) {
      localStorage.removeItem('aetheria_journal');
      renderMoodStats();
      renderJournalPreview();
      renderMoodChart();
      showToast('🗑️ Mood journal cleared.');
    }
  });

  // Chat UI Actions
  sendBtn?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  quickPrompts?.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-prompt-btn');
    if (!btn) return;
    if (chatInput) chatInput.value = btn.dataset.prompt;
    sendMessage();
    quickPrompts.classList.add('hidden');
  });

  // Sidebar & Navigation
  $('#newChatBtn')?.addEventListener('click', () => { closeSidebar(); if (state.currentMood) startConversation(); });
  $('#changeMoodBtn')?.addEventListener('click', () => { closeSidebar(); if (appShell) appShell.classList.remove('active'); showScreen(moodScreen); });
  $('#dashBtn')?.addEventListener('click', () => { closeSidebar(); if (appShell) appShell.classList.remove('active'); goToDashboard(); });

  const sidebar = $('.sidebar');
  const sidebarOverlay = $('#sidebarOverlay');
  function openSidebar() { if (sidebar) sidebar.classList.add('open'); if (sidebarOverlay) sidebarOverlay.classList.add('active'); }
  function closeSidebar() { if (sidebar) sidebar.classList.remove('open'); if (sidebarOverlay) sidebarOverlay.classList.remove('active'); }

  $('#mobileMenuBtn')?.addEventListener('click', () => {
    if (sidebar) sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Command Palette Handlers
  $('#dashCmdBtn')?.addEventListener('click', openCommandPalette);
  $('#paletteInput')?.addEventListener('input', (e) => renderPaletteResults(e.target.value));

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandPalette?.classList.contains('active') ? closeCommandPalette() : openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeBreathe();
      closeGrounding();
      closePersonaModal();
      closeGratitudeModal();
      closeMeditationModal();
      closeZenSanctuary();
      comfortVaultModal?.classList.remove('active');
      soundMixerModal?.classList.remove('active');
      closeApiKeyModal();
    }
  });

  // Keyboard accessibility on cards
  $$('.dash-card, .mood-card').forEach((card) => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Theme Toggle
  const themeBtn = $('#themeToggleBtn');
  let isLight = localStorage.getItem('aetheria_theme') === 'light';

  function applyTheme() {
    if (isLight) {
      document.body.classList.add('light-theme');
      if (themeBtn) themeBtn.textContent = '☀️';
    } else {
      document.body.classList.remove('light-theme');
      if (themeBtn) themeBtn.textContent = '🌙';
    }
  }
  applyTheme();

  themeBtn?.addEventListener('click', () => {
    isLight = !isLight;
    localStorage.setItem('aetheria_theme', isLight ? 'light' : 'dark');
    applyTheme();
    showToast(isLight ? '☀️ Light mode' : '🌙 Dark mode');
  });

  // Voice Toggle & Mic
  voiceToggleBtn?.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    localStorage.setItem('aetheria_voice', voiceEnabled);
    if (voiceEnabled) {
      voiceToggleBtn.classList.add('voice-active');
      voiceToggleBtn.textContent = '🔊';
      showToast('🔊 Voice responses enabled');
    } else {
      voiceToggleBtn.classList.remove('voice-active');
      voiceToggleBtn.textContent = '🔇';
      window.speechSynthesis.cancel();
      showToast('🔇 Voice responses disabled');
    }
  });

  micBtn?.addEventListener('click', () => {
    if (!recognition) {
      showToast('🎤 Voice input not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      if (chatInput) chatInput.value = '';
      recognition.start();
    }
  });

  /* ═══════════════════════════════════════════
     19. BOOTSTRAP INITIALIZATION
     ═══════════════════════════════════════════ */
  initStoredApiKey();

  if (state.userName) {
    if (loginScreen) {
      loginScreen.classList.remove('active');
      loginScreen.classList.add('hidden');
    }
    goToDashboard();
  } else {
    showScreen(loginScreen);
  }

  // Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Service Worker registration skipped:', err);
      });
    });
  }

})();

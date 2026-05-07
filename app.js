/* AETHERIA ✨ — App Logic (No API key required — works offline!) */
(function () {
  'use strict';

  /* ── State ── */
  const state = {
    userName: localStorage.getItem('aetheria_user') || '',
    apiKey: localStorage.getItem('aetheria_api_key') || '',
    currentMood: null,
    chatHistory: [],
    isTyping: false,
    breatheInterval: null,
    messageCount: 0,
  };

  /* ── Mood Configs ── */
  const MOODS = {
    angry: { label: 'Angry', emoji: '😡', color: '#E85D75', glow: 'rgba(232,93,117,.3)',
      greeting: "I can feel that fire in you. Let it out — I'm here, no judgment. What's got you heated?",
      prompt: 'The user is angry. Validate their anger, let them vent. Never dismiss their feelings.' },
    sad: { label: 'Sad', emoji: '😢', color: '#5B8DEF', glow: 'rgba(91,141,239,.3)',
      greeting: "Hey... I'm right here with you. You don't have to carry this alone. What's weighing on your heart?",
      prompt: 'The user is sad. Be gentle, warm, comforting. Let them know it is okay to feel this way.' },
    anxious: { label: 'Anxious', emoji: '😰', color: '#4ECDC4', glow: 'rgba(78,205,196,.3)',
      greeting: "Take a deep breath with me... You're safe here. What's making you feel uneasy?",
      prompt: 'The user is anxious. Be calming and grounding. Suggest breathing when appropriate.' },
    frustrated: { label: 'Frustrated', emoji: '😤', color: '#F5A86C', glow: 'rgba(245,168,108,.3)',
      greeting: "Ugh, I get it — sometimes things just don't cooperate. What's been frustrating you?",
      prompt: 'The user is frustrated. Empathize with their struggle. Acknowledge the difficulty.' },
    happy: { label: 'Happy', emoji: '😊', color: '#FFD93D', glow: 'rgba(255,217,61,.3)',
      greeting: "Your energy is contagious! 🌟 I'd love to hear what's making you smile!",
      prompt: 'The user is happy. Celebrate with them! Share their joy enthusiastically.' },
    lonely: { label: 'Lonely', emoji: '🥺', color: '#9B8AFF', glow: 'rgba(155,138,255,.3)',
      greeting: "I'm here, and I'm glad you came. You're not alone right now. Tell me what's on your mind.",
      prompt: 'The user is lonely. Be warm, present, attentive. Make them feel seen and valued.' },
    overwhelmed: { label: 'Overwhelmed', emoji: '🤯', color: '#C77DFF', glow: 'rgba(199,125,255,.3)',
      greeting: "That's a lot to carry. Let's slow down. Share one thing at a time — no rush here.",
      prompt: 'The user is overwhelmed. Help them slow down. Be patient and gentle.' },
    numb: { label: 'Numb', emoji: '😶', color: '#7B8794', glow: 'rgba(123,135,148,.3)',
      greeting: "Sometimes we feel... nothing. And that's okay too. I'm here whenever you're ready.",
      prompt: 'The user is numb. Be gentle, do not force emotion. Let them set the pace.' },
  };

  /* ── Smart Local Responses (No API needed!) ── */
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
      "Would it help to try a breathing exercise? Sometimes grounding ourselves physically can ease the mental noise.",
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
      "I hear you, and your feelings matter. Is there anything specific you'd like to talk about or explore?",
      "You're doing great just by expressing yourself. What else is on your mind?",
    ],
  };

  const AFFIRMATIONS = [
    "You are worthy of love and kindness — especially from yourself.",
    "It's okay to take things one moment at a time.",
    "Your feelings are valid, and so is your need for rest.",
    "You don't have to be perfect to be worthy of love.",
    "Every small step forward counts. You're doing better than you think.",
    "The world is better because you're in it. 💜",
    "Healing isn't linear — and that's perfectly okay.",
    "You deserve the same compassion you give to others.",
    "Today is a new page. You get to decide what goes on it.",
    "Breathe. You are exactly where you need to be right now.",
  ];

  const BASE_PROMPT = `You are Aetheria, a warm, deeply empathetic emotional wellness companion. Rules:
1. Listen actively, validate feelings — never judge or dismiss.
2. Respond like a caring best friend — not a therapist or robot.
3. Keep responses concise (2-4 sentences). Be natural and warm.
4. Use gentle humor only when appropriate. Never force positivity.
5. Ask thoughtful follow-up questions naturally.
6. Suggest coping techniques gently when appropriate.
7. Never use clinical language. Speak from the heart.
8. Use emojis sparingly and naturally.
9. Remember earlier conversation context.
10. If someone expresses serious distress, encourage professional help and provide crisis info.`;

  /* ── DOM Refs ── */
  const $ = (s) => document.querySelector(s);

  const loginScreen = $('#loginScreen');
  const dashboardScreen = $('#dashboardScreen');
  const moodScreen = $('#moodScreen');
  const apiKeyModal = $('#apiKeyModal');
  const appShell = $('#appShell');
  const breatheOverlay = $('#breatheOverlay');

  const nameInput = $('#nameInput');
  const loginBtn = $('#loginBtn');
  const loginError = $('#loginError');
  const dashName = $('#dashName');
  const dashTimeLabel = $('#dashTimeLabel');
  const moodUserName = $('#moodUserName');
  const moodGrid = $('#moodGrid');
  const apiKeyInput = $('#apiKeyInput');
  const apiKeySubmit = $('#apiKeySubmit');
  const apiKeyError = $('#apiKeyError');
  const messagesContainer = $('#messagesContainer');
  const chatInput = $('#chatInput');
  const sendBtn = $('#sendBtn');
  const typingIndicator = $('#typingIndicator');
  const currentMoodEmoji = $('#currentMoodEmoji');
  const currentMoodText = $('#currentMoodText');
  const breatheCircle = $('#breatheCircle');
  const breatheLabel = $('#breatheLabel');
  const moodStats = $('#moodStats');
  const journalPreview = $('#journalPreview');
  const affirmationText = $('#affirmationText');
  const quickPrompts = $('#quickPrompts');
  const toast = $('#toast');
  const canvas = $('#particleCanvas');
  const ctx = canvas.getContext('2d');

  /* ── Utilities ── */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
  }

  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning,';
    if (h < 17) return 'Good afternoon,';
    return 'Good evening,';
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Enhanced Particles + Stars + Shooting Stars ── */
  let stars = [];
  let shootingStars = [];
  let frameCount = 0;

  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    // Twinkling stars
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        baseA: Math.random() * 0.4 + 0.1, a: 0, twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7 ? (Math.random() > 0.5 ? 260 : 160) : 0, // purple or teal tint
      });
    }
  }

  function spawnShootingStar() {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Draw twinkling stars
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = canvas.width; if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height; if (s.y > canvas.height) s.y = 0;
      s.a = s.baseA + Math.sin(frameCount * s.twinkleSpeed + s.twinkleOffset) * s.baseA * 0.6;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue},70%,70%,${s.a})`;
      } else {
        ctx.fillStyle = `rgba(200,195,230,${s.a})`;
      }
      ctx.fill();

      // Star glow for bigger stars
      if (s.r > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,111,235,${s.a * 0.15})`;
        ctx.fill();
      }
    }

    // Draw shooting stars
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
      // Head glow
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${ss.life})`;
      ctx.fill();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= ss.decay;
      if (ss.life <= 0) shootingStars.splice(i, 1);
    }

    // Random shooting star spawn
    if (Math.random() < 0.004) spawnShootingStar();

    requestAnimationFrame(drawCanvas);
  }

  window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  initCanvas();
  drawCanvas();

  /* ── Floating Sparkles on Hover ── */
  function spawnSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = pickRandom(['✦', '✧', '⋆', '✶', '·']);
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.color = pickRandom(['#7C6FEB', '#6BC5A0', '#F5A86C', '#9B8AFF', '#fff']);
    sparkle.style.fontSize = (Math.random() * 10 + 8) + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4000);
  }

  // Spawn sparkles on mood card and button clicks
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood-card, .login-btn, .dash-card, .quick-prompt-btn');
    if (btn) {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnSparkle(
            e.clientX + (Math.random() - 0.5) * 60,
            e.clientY + (Math.random() - 0.5) * 40
          );
        }, i * 80);
      }
    }
  });

  /* ── Screen Navigation ── */
  function showScreen(screenEl) {
    document.querySelectorAll('.screen').forEach((s) => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });
    appShell.classList.remove('active');
    setTimeout(() => { screenEl.classList.remove('hidden'); screenEl.classList.add('active'); }, 100);
  }
  function showChat() {
    document.querySelectorAll('.screen').forEach((s) => { s.classList.remove('active'); s.classList.add('hidden'); });
    apiKeyModal.classList.remove('active');
    setTimeout(() => { appShell.classList.add('active'); }, 200);
  }

  /* ── Login ── */
  loginBtn.addEventListener('click', handleLogin);
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleLogin(); });

  function handleLogin() {
    const name = nameInput.value.trim();
    if (!name) { loginError.style.display = 'block'; return; }
    loginError.style.display = 'none';
    state.userName = name;
    localStorage.setItem('aetheria_user', name);
    goToDashboard();
  }

  /* Auto-login if name exists */
  if (state.userName) {
    loginScreen.classList.remove('active');
    loginScreen.classList.add('hidden');
    goToDashboard();
  }

  function goToDashboard() {
    dashName.textContent = state.userName;
    dashTimeLabel.textContent = getTimeGreeting();
    moodUserName.textContent = state.userName;
    affirmationText.textContent = pickRandom(AFFIRMATIONS);
    renderMoodStats();
    renderJournalPreview();
    showScreen(dashboardScreen);
  }

  /* ── Dashboard Actions ── */
  $('#startChatCard').addEventListener('click', () => { showScreen(moodScreen); });
  $('#breatheCard').addEventListener('click', openBreathe);
  $('#logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('aetheria_user');
    state.userName = '';
    nameInput.value = '';
    showScreen(loginScreen);
    showToast('Signed out successfully');
  });

  /* ── Mood Back Button ── */
  $('#moodBackBtn')?.addEventListener('click', () => { goToDashboard(); });

  /* ── Mood Selection ── */
  moodGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.mood-card');
    if (!card) return;
    const mood = card.dataset.mood;
    state.currentMood = mood;
    state.messageCount = 0;
    const cfg = MOODS[mood];

    document.documentElement.style.setProperty('--mood-color', cfg.color);
    document.documentElement.style.setProperty('--mood-glow', cfg.glow);
    currentMoodEmoji.textContent = cfg.emoji;
    currentMoodText.textContent = cfg.label;
    if ($('#sidebarUser')) $('#sidebarUser').textContent = state.userName;

    saveMoodToJournal(mood);
    card.style.transform = 'scale(.92)';
    setTimeout(() => { card.style.transform = ''; }, 200);

    // Skip API key — go straight to chat (local responses work without it)
    showChat();
    startConversation();
  });

  /* ── API Key (Optional — accessed from sidebar or settings) ── */
  apiKeySubmit.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) { apiKeyError.style.display = 'block'; return; }
    apiKeyError.style.display = 'none';
    state.apiKey = key;
    localStorage.setItem('aetheria_api_key', key);
    apiKeyModal.classList.remove('active');
    showToast('✨ AI connected! Responses are now powered by Gemini.');
    if (state.currentMood) {
      showChat();
      startConversation();
    }
  });
  apiKeyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') apiKeySubmit.click(); });

  // Toggle API key visibility
  $('#toggleKeyVis')?.addEventListener('click', () => {
    const inp = apiKeyInput;
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  /* ── Chat ── */
  function startConversation() {
    state.chatHistory = [];
    state.messageCount = 0;
    messagesContainer.innerHTML = '';
    if (quickPrompts) quickPrompts.classList.remove('hidden');
    const cfg = MOODS[state.currentMood];
    addMessage('ai', cfg.greeting);
  }

  function addMessage(role, text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const avatar = role === 'ai' ? '✨' : '🫧';
    div.innerHTML = `<div class="msg-avatar">${avatar}</div><div class="msg-content"><div class="msg-bubble">${formatMessage(text)}</div><span class="msg-time">${time}</span></div>`;
    messagesContainer.appendChild(div);
    scrollToBottom();
    state.chatHistory.push({ role: role === 'ai' ? 'model' : 'user', parts: [{ text }] });
    // Voice: speak AI responses aloud if enabled
    if (role === 'ai' && typeof speakText === 'function') speakText(text);
  }

  function formatMessage(s) {
    // Escape HTML but preserve basic formatting
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function scrollToBottom() { setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 50); }

  /* ── Quick Prompts ── */
  quickPrompts?.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-prompt-btn');
    if (!btn) return;
    chatInput.value = btn.dataset.prompt;
    sendMessage();
    quickPrompts.classList.add('hidden');
  });

  /* ── Send Message ── */
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || state.isTyping) return;
    chatInput.value = '';
    if (quickPrompts) quickPrompts.classList.add('hidden');
    addMessage('user', text);
    state.isTyping = true;
    state.messageCount++;
    typingIndicator.classList.add('active');
    scrollToBottom();

    try {
      let res;
      if (state.apiKey) {
        res = await callGeminiAPI(text);
      } else {
        res = await getLocalResponse(text);
      }
      typingIndicator.classList.remove('active');
      state.isTyping = false;
      addMessage('ai', res);
    } catch (err) {
      typingIndicator.classList.remove('active');
      state.isTyping = false;
      console.error('Response error:', err);
      // Fallback to local response on API error
      const fallback = await getLocalResponse(text);
      addMessage('ai', fallback);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

  /* ── Smart Local Response Engine ── */
  function getLocalResponse(userMessage) {
    return new Promise((resolve) => {
      // Simulate thinking delay for natural feel
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        const mood = state.currentMood || 'fallback';
        const pool = LOCAL_RESPONSES[mood] || LOCAL_RESPONSES.fallback;
        const msg = userMessage.toLowerCase();

        // Keyword-based contextual responses
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
          resolve("I care about you deeply. If you're in crisis, please reach out to a professional: National Suicide Prevention Lifeline — 988 (call or text). You matter, and help is available. 💜");
        } else if (msg.includes('breathe') || msg.includes('breathing') || msg.includes('calm')) {
          resolve("Let's try a breathing exercise! Click the 🫁 button in the sidebar or header. The 4-4-4 technique really helps — breathe in for 4 seconds, hold for 4, exhale for 4. 🌿");
        } else if (msg.includes('who are you') || msg.includes('what are you')) {
          resolve(`I'm Aetheria, your emotional wellness companion ✨. I'm here to listen, support, and walk alongside you — no judgment, just warmth. Think of me as a friend who's always available.`);
        } else {
          // Pick a response we haven't used recently
          resolve(pool[state.messageCount % pool.length]);
        }
      }, delay);
    });
  }

  /* ── Gemini API (Optional Enhancement) ── */
  async function callGeminiAPI(userMessage) {
    const cfg = MOODS[state.currentMood];
    const sysText = `${BASE_PROMPT}\n\nThe user's name is ${state.userName}. ${cfg.prompt}`;
    const body = {
      system_instruction: { parts: [{ text: sysText }] },
      contents: state.chatHistory.map((m) => ({ role: m.role, parts: m.parts })),
      generationConfig: { temperature: 0.85, topP: 0.92, topK: 40, maxOutputTokens: 300 },
    };
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${state.apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || res.status); }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response');
    return text.trim();
  }

  /* ── Breathing Exercise ── */
  let breatheRunning = false;
  function openBreathe() { breatheOverlay.classList.add('active'); }
  function startBreathe() {
    breatheRunning = true;
    $('#breatheStartBtn').style.display = 'none';
    let phase = 0;
    const phases = [
      { label: 'Breathe in...', cls: 'inhale', text: 'Inhale', ms: 4000 },
      { label: 'Hold...', cls: 'inhale', text: 'Hold', ms: 4000 },
      { label: 'Breathe out...', cls: 'exhale', text: 'Exhale', ms: 4000 },
    ];
    function next() {
      if (!breatheRunning) return;
      const p = phases[phase % 3];
      breatheCircle.className = 'breathe-circle ' + p.cls;
      breatheCircle.textContent = p.text;
      breatheLabel.textContent = p.label;
      phase++;
      state.breatheInterval = setTimeout(next, p.ms);
    }
    next();
  }
  function stopBreathe() {
    breatheRunning = false;
    clearTimeout(state.breatheInterval);
    breatheCircle.className = 'breathe-circle';
    breatheCircle.textContent = 'Ready';
    breatheLabel.textContent = 'Press start to begin';
    $('#breatheStartBtn').style.display = '';
    breatheOverlay.classList.remove('active');
  }
  $('#breatheStartBtn').addEventListener('click', startBreathe);
  $('#breatheCloseBtn').addEventListener('click', stopBreathe);
  $('#breatheBtn')?.addEventListener('click', openBreathe);
  $('#headerBreatheBtn')?.addEventListener('click', openBreathe);

  /* ── Sidebar Buttons ── */
  $('#newChatBtn')?.addEventListener('click', () => { if (state.currentMood) startConversation(); });
  $('#changeMoodBtn')?.addEventListener('click', () => { appShell.classList.remove('active'); showScreen(moodScreen); });
  $('#dashBtn')?.addEventListener('click', () => { appShell.classList.remove('active'); goToDashboard(); });

  /* ── Journal ── */
  function saveMoodToJournal(mood) {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    j.unshift({ mood, emoji: MOODS[mood].emoji, label: MOODS[mood].label, date: new Date().toISOString() });
    if (j.length > 30) j.length = 30;
    localStorage.setItem('aetheria_journal', JSON.stringify(j));
  }

  function renderJournalPreview() {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    if (!j.length) { journalPreview.innerHTML = '<p style="font-size:.8rem;color:var(--text-muted)">No entries yet. Start chatting!</p>'; return; }
    journalPreview.innerHTML = j.slice(0, 6).map((e) => {
      const d = new Date(e.date);
      return `<div class="jp-entry"><span class="jp-emoji">${e.emoji}</span><span class="jp-text">${e.label}</span><span class="jp-date">${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>`;
    }).join('');
  }

  function renderMoodStats() {
    const j = JSON.parse(localStorage.getItem('aetheria_journal') || '[]');
    const counts = {};
    j.forEach((e) => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!sorted.length) { moodStats.innerHTML = '<p style="font-size:.8rem;color:var(--text-muted)">No data yet</p>'; return; }
    moodStats.innerHTML = sorted.map(([m, c]) => `<div class="stat-pill"><span class="pill-emoji">${MOODS[m]?.emoji || '❓'}</span><span class="pill-count">${c}</span></div>`).join('');
  }

  /* ══════════════════════════════════════════
     VOICE CHAT — Speech-to-Text & Text-to-Speech
     ══════════════════════════════════════════ */

  const micBtn = $('#micBtn');
  const voiceToggleBtn = $('#voiceToggleBtn');
  let voiceEnabled = localStorage.getItem('aetheria_voice') === 'true';
  let recognition = null;
  let isRecording = false;

  // Initialize voice toggle state
  if (voiceEnabled && voiceToggleBtn) {
    voiceToggleBtn.classList.add('voice-active');
    voiceToggleBtn.textContent = '🔊';
  }

  /* ── Text-to-Speech (AI reads responses aloud) ── */
  function speakText(text) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;

    // Try to pick a pleasant voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') && v.lang.startsWith('en')
    ) || voices.find(v =>
      v.lang.startsWith('en') && v.name.includes('Female')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }

  // Ensure voices are loaded
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }

  /* ── Voice Toggle Button ── */
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

  /* ── Speech-to-Text (Mic Input) ── */
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      micBtn.style.display = 'none';
      return null;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      isRecording = true;
      micBtn.classList.add('recording');
      micBtn.textContent = '⏹';
      chatInput.placeholder = '🎙 Listening...';
    };

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      chatInput.value = transcript;
    };

    rec.onend = () => {
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎤';
      chatInput.placeholder = "Share what's on your mind...";
      // Auto-send if we got text
      if (chatInput.value.trim()) {
        sendMessage();
      }
    };

    rec.onerror = (event) => {
      isRecording = false;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎤';
      chatInput.placeholder = "Share what's on your mind...";
      if (event.error === 'not-allowed') {
        showToast('🎤 Microphone access denied. Please allow mic access.');
      } else if (event.error !== 'aborted') {
        showToast('🎤 Voice input error. Try again.');
      }
    };

    return rec;
  }

  recognition = initSpeechRecognition();

  micBtn?.addEventListener('click', () => {
    if (!recognition) {
      showToast('🎤 Voice input not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      chatInput.value = '';
      recognition.start();
    }
  });


})();

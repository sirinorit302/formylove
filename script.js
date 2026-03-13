/* ============================================
   💕 ปุ้ว & มุ้ว Anniversary Website - Script
   ============================================ */

// ===== DATE CONFIG =====
const ANNIVERSARY_DATE = new Date(2016, 2, 13); // March 13, 2016 (months are 0-indexed)

// ===== STARS BACKGROUND =====
function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;

    for (let i = 0; i < 80; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = (Math.random() * 3 + 1) + 'px';
        star.style.height = star.style.width;
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        star.style.animationDelay = (Math.random() * 3) + 's';
        container.appendChild(star);
    }
}

// ===== FLOATING HEARTS =====
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    if (!container) return;

    const hearts = ['💕', '❤️', '💗', '💖', '💝', '🩷', '🤍', '✨', '🌸'];

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 8) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 20000);
    }

    // Spawn initial hearts
    for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnHeart(), i * 800);
    }

    // Keep spawning
    setInterval(spawnHeart, 3000);
}

// ===== ENVELOPE / INTRO =====
let envelopeOpened = false;

function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    const envelope = document.getElementById('envelope');
    const intro = document.getElementById('intro');
    const mainContent = document.getElementById('main-content');

    envelope.classList.add('opened');

    // Create burst of hearts
    createHeartBurst();

    // Fade out intro after delay
    setTimeout(() => {
        intro.classList.add('fade-out');
    }, 1200);

    // Show main content
    setTimeout(() => {
        intro.style.display = 'none';
        mainContent.classList.remove('hidden');
        window.scrollTo(0, 0);

        // Start animations  
        startLoveCounter();
        initGallery();
        initScrollAnimations();
    }, 2200);
}

function createHeartBurst() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['💕', '❤️', '💗', '💖', '💝', '🩷', '✨'];

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = (40 + Math.random() * 20) + '%';
            heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
            heart.style.animationDuration = (Math.random() * 4 + 3) + 's';
            heart.style.animationDelay = '0s';
            container.appendChild(heart);

            setTimeout(() => heart.remove(), 8000);
        }, i * 100);
    }
}

// ===== LOVE COUNTER =====
function startLoveCounter() {
    function updateCounter() {
        const now = new Date();
        const diff = now - ANNIVERSARY_DATE;

        // Calculate years, months, days
        let years = now.getFullYear() - ANNIVERSARY_DATE.getFullYear();
        let months = now.getMonth() - ANNIVERSARY_DATE.getMonth();
        let days = now.getDate() - ANNIVERSARY_DATE.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        // Update DOM with animation
        animateNumber('count-years', years);
        animateNumber('count-months', months);
        animateNumber('count-days', days);
        animateNumber('count-hours', hours);
        animateNumber('count-minutes', minutes);
        animateNumber('count-seconds', seconds);

        const totalDaysEl = document.getElementById('total-days');
        if (totalDaysEl) {
            totalDaysEl.textContent = totalDays.toLocaleString();
        }
    }

    updateCounter();
    setInterval(updateCounter, 1000);
}

function animateNumber(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    if (current !== value) {
        el.textContent = value;
        el.style.transform = 'scale(1.2)';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.transition = 'transform 0.3s ease';
        }, 50);
    }
}

// ===== PHOTO GALLERY =====
let currentSlide = 0;
let totalSlides = 0;
let autoSlideInterval = null;

function initGallery() {
    const track = document.getElementById('gallery-track');
    if (!track) return;

    totalSlides = track.children.length;
    document.getElementById('total-slides').textContent = totalSlides;

    // Create dots
    const dotsContainer = document.getElementById('gallery-dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    // Auto slide
    startAutoSlide();

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = document.querySelector('.gallery-viewport');

    viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    });

    viewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoSlide();
    });
}

function goToSlide(index) {
    currentSlide = index;
    const track = document.getElementById('gallery-track');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });

    // Update counter
    document.getElementById('current-slide').textContent = currentSlide + 1;
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// ===== QUIZ GAME =====
const quizQuestions = [
    {
        question: "💕 ปุ้วกับนู่คบกันวันที่เท่าไหร่?",
        options: ["13 มีนาคม 2559", "14 กุมภาพันธ์ 2559", "1 มกราคม 2559", "25 ธันวาคม 2558"],
        correct: 0
    },
    {
        question: "🎂 ตอนนี้ปุ้วกับนู่คบกันกี่ปีแล้ว?",
        options: ["8 ปี", "9 ปี", "10 ปี", "11 ปี"],
        correct: 2
    },
    {
        question: "💑 อะไรคือสิ่งที่ทำให้ปุ้วกับนู่รักกันยืนยาว?",
        options: ["เงินทอง", "ความเข้าใจ", "หน้าตา", "พุงปุ้ว"],
        correct: 1
    },
    {
        question: "🌟 ปุ้วอยากบอกอะไรนู่มากที่สุด?",
        options: ["ขอยืมเงิน", "รักนู่ที่สุดเลย", "หิวข้าว", "ง่วงนอน"],
        correct: 1
    },
    {
        question: "💍 ปุ้วสัญญาว่าจะ...?",
        options: ["ไปเที่ยวคนเดียว", "กินข้าวไม่ชวน", "รักนู่ตลอดไป", "นอนทั้งวัน"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

function initQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const q = quizQuestions[currentQuestion];
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const resultEl = document.getElementById('quiz-result');
    const progressBar = document.getElementById('quiz-progress-bar');

    resultEl.classList.add('hidden');
    questionEl.textContent = q.question;

    document.getElementById('quiz-current').textContent = currentQuestion + 1;
    document.getElementById('quiz-total').textContent = quizQuestions.length;
    progressBar.style.width = ((currentQuestion) / quizQuestions.length * 100) + '%';

    optionsEl.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index, btn);
        optionsEl.appendChild(btn);
    });
}

function selectAnswer(index, btn) {
    const q = quizQuestions[currentQuestion];
    const optionsEl = document.getElementById('quiz-options');
    const allBtns = optionsEl.querySelectorAll('.quiz-option');

    // Disable all buttons
    allBtns.forEach(b => {
        b.style.pointerEvents = 'none';
    });

    if (index === q.correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allBtns[q.correct].classList.add('correct');
    }

    // Next question or show results
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showQuizResult();
        }
    }, 1500);
}

function showQuizResult() {
    const progressBar = document.getElementById('quiz-progress-bar');
    progressBar.style.width = '100%';

    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const resultEl = document.getElementById('quiz-result');
    const scoreEl = document.getElementById('quiz-score');
    const messageEl = document.getElementById('quiz-message');

    questionEl.textContent = '🎉 จบเกมแล้ว!';
    optionsEl.innerHTML = '';
    resultEl.classList.remove('hidden');

    scoreEl.textContent = `${score} / ${quizQuestions.length}`;

    let message = '';
    const percent = score / quizQuestions.length;
    if (percent === 1) {
        message = '🎉 เก่งมาก! ตอบถูกหมดเลย!\nนู่รู้จักปุ้วดีมากจริงๆ 💕\nปุ้วรักนู่ที่สุดเลย!';
    } else if (percent >= 0.6) {
        message = '😊 เก่งมาก! นู่รู้จักปุ้วดีนะ 💕\nแต่ว่ามาเรียนรู้กันเพิ่มอีกนะ!';
    } else {
        message = '🤭 ไม่เป็นไร~ เราจะได้เรียนรู้กันเพิ่ม 💕\nปุ้วรอเล่าให้ฟังอยู่นะ!';
    }

    messageEl.textContent = message;
    messageEl.style.whiteSpace = 'pre-line';

    // Heart burst on completion
    createHeartBurst();
}

function restartQuiz() {
    initQuiz();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // Promise cards
    document.querySelectorAll('.promise-card').forEach((card, index) => {
        card.style.transitionDelay = (index * 0.15) + 's';
        observer.observe(card);
    });
}

// Music removed as requested

// ===== BREAKUP BUTTON GAME (เกมกวนๆ #1) =====
let breakupAttempts = 0;
const breakupTaunts = [
    'หาหา! กดไม่โดนหรอก~ 😜',
    'โอ๊ย! มาไม่ถึงแล้ว! 🏃',
    'เร็วกว่านั้นอีก~ 💨',
    'หยุดพัก! กด "ไม่เลิก" ดีกว่า! 😂',
    'ปุ่มนี้คือคำตอบที่ถูก! กดไป! ❤️',
    'อย่า~ เลิกไม่ได้นะครับ! 😏',
    'เห็นมั้ย~ กดปุ่มสีชมพูคือคำตอบ! 🥰',
    'กดนานกี่ครั้งแล้ว! ยอมแพ้เถอะ! 😘',
];

function runAwayButton(event) {
    // Prevent double-firing on touch devices (touchstart + click)
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const btn = document.getElementById('btn-yes-breakup');
    const container = document.querySelector('.breakup-container');
    const hint = document.getElementById('breakup-hint');
    const text = document.getElementById('breakup-text');

    breakupAttempts++;

    // Get container bounds
    const containerRect = container.getBoundingClientRect();
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;

    // Random position within container
    const maxX = containerRect.width - btnWidth - 20;
    const maxY = containerRect.height - btnHeight - 20;
    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    // Make button move to random position
    btn.style.position = 'relative';
    btn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    btn.style.transition = 'transform 0.1s ease';

    // Shrink button over time
    const scale = Math.max(0.4, 1 - breakupAttempts * 0.08);
    btn.style.fontSize = `${scale}rem`;
    btn.style.padding = `${10 * scale}px ${20 * scale}px`;

    // Update taunt text
    const tauntIndex = Math.min(breakupAttempts - 1, breakupTaunts.length - 1);
    hint.textContent = breakupTaunts[tauntIndex];

    // Make "no breakup" button grow
    const noBtn = document.getElementById('btn-no-breakup');
    const growScale = Math.min(1.5, 1 + breakupAttempts * 0.05);
    noBtn.style.transform = `scale(${growScale})`;

    // Change question text after many attempts
    if (breakupAttempts >= 5) {
        text.textContent = 'หยุดเถอะ! กด "ไม่เลิก" ซะ! 😂💕';
    }
    if (breakupAttempts >= 8) {
        text.textContent = 'อย่าดื้อ! ปุ้วรักนู่! 🥺❤️';
    }
}

function clickedNoBreakup() {
    const container = document.querySelector('.breakup-container');
    const question = container.querySelector('.breakup-question');
    const buttons = container.querySelector('.breakup-buttons');
    const hint = document.getElementById('breakup-hint');
    const result = document.getElementById('breakup-result');

    // Hide question and buttons
    question.style.display = 'none';
    buttons.style.display = 'none';
    hint.style.display = 'none';

    // Show result
    result.classList.remove('hidden');

    // Heart burst!
    createHeartBurst();
}


// ===== WOW CURSOR TRAIL (Canvas Optimized) =====
function initCursorHeartTrail() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const hearts = ['💕', '💕', '💗', '💖', '✨', '🌸'];

    let lastSpawn = 0;

    function spawnParticle(x, y) {
        const now = Date.now();
        if (now - lastSpawn < 30) return;
        lastSpawn = now;

        particles.push({
            x: x,
            y: y,
            char: hearts[Math.floor(Math.random() * hearts.length)],
            life: 1,
            size: Math.random() * 12 + 12,
            vy: Math.random() * -2 - 1,
            vx: Math.random() * 2 - 1,
            rot: Math.random() * 360,
            rotSpeed: Math.random() * 4 - 2
        });
    }

    window.addEventListener('mousemove', (e) => {
        spawnParticle(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            spawnParticle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.015;
            p.y += p.vy;
            p.x += p.vx;
            p.rot += p.rotSpeed;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.font = `${p.size}px "Noto Sans Thai", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.translate(p.x, p.y);
            ctx.fillText(p.char, 0, 0);
            ctx.restore();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Enter' && !envelopeOpened) openEnvelope();
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createFloatingHearts();
    initCursorHeartTrail();
    initQuiz();

    // === iOS Viewport Height Fix ===
    // iOS Safari doesn't respect 100vh correctly, this sets a CSS variable
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVH();
    window.addEventListener('resize', setVH);

    // Audio resume feature removed
});

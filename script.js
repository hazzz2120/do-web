const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];


/* =========================================================
   LOADER
========================================================= */

const loader = $('#loader');
const loaderPct = $('#loaderPct');

let pct = 0;

const boot = setInterval(() => {
    pct = Math.min(
        100,
        pct + Math.floor(Math.random() * 12) + 5
    );

    if (loaderPct) {
        loaderPct.textContent = pct;
    }

    if (pct >= 100) {
        clearInterval(boot);

        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
            }
        }, 250);

        setTimeout(() => {
            if (loader) {
                loader.remove();
            }
        }, 800);
    }
}, 90);


/* =========================================================
   BACKGROUND — STARS + FLOATING PARTICLES
========================================================= */

const canvas = $('#space');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let W = 0;
    let H = 0;
    let dpr = 1;

    let stars = [];
    let particles = [];

    function resize() {
        dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        W = canvas.clientWidth;
        H = canvas.clientHeight;

        canvas.width = W * dpr;
        canvas.height = H * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        stars = Array.from(
            { length: 150 },
            () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.3 + 0.2,
                a: Math.random() * 0.65 + 0.15,
                s: Math.random() * 0.18 + 0.02
            })
        );

        particles = Array.from(
            {
                length: Math.min(
                    45,
                    Math.max(
                        20,
                        Math.floor(W / 25)
                    )
                )
            },
            () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 2.2 + 0.6,
                baseX: Math.random() * W,
                speedY: Math.random() * 0.35 + 0.08,
                drift: Math.random() * 0.7 + 0.2,
                phase: Math.random() * Math.PI * 2,
                alpha: Math.random() * 0.4 + 0.08,
                direction: Math.random() > 0.5 ? 1 : -1
            })
        );
    }

    resize();

    window.addEventListener(
        'resize',
        resize
    );

    let particleTime = 0;

    function draw() {
        particleTime += 0.01;

        ctx.clearRect(
            0,
            0,
            W,
            H
        );

        /* -----------------------------------------
           STARS
        ----------------------------------------- */

        for (const s of stars) {
            s.y -= s.s;

            if (s.y < -2) {
                s.y = H + 2;
            }

            ctx.globalAlpha =
                s.a *
                (
                    0.55 +
                    0.45 *
                    Math.sin(
                        Date.now() / 900 +
                        s.x
                    )
                );

            ctx.fillStyle = '#d8c7ff';

            ctx.beginPath();

            ctx.arc(
                s.x,
                s.y,
                s.r,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        /* -----------------------------------------
           FLOATING PARTICLES
        ----------------------------------------- */

        for (const p of particles) {
            p.y +=
                p.speedY *
                p.direction;

            if (
                p.direction > 0 &&
                p.y > H + 10
            ) {
                p.y = -10;
                p.x = Math.random() * W;
                p.baseX = p.x;
            }

            if (
                p.direction < 0 &&
                p.y < -10
            ) {
                p.y = H + 10;
                p.x = Math.random() * W;
                p.baseX = p.x;
            }

            const waveX =
                Math.sin(
                    particleTime * p.drift +
                    p.phase
                ) * 25;

            const drawX =
                p.baseX +
                waveX;

            const glow =
                ctx.createRadialGradient(
                    drawX,
                    p.y,
                    0,
                    drawX,
                    p.y,
                    p.r * 5
                );

            glow.addColorStop(
                0,
                `rgba(210,190,255,${p.alpha})`
            );

            glow.addColorStop(
                1,
                'rgba(210,190,255,0)'
            );

            ctx.fillStyle = glow;
            ctx.globalAlpha = 1;

            ctx.beginPath();

            ctx.arc(
                drawX,
                p.y,
                p.r * 4,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = '#eadfff';

            ctx.globalAlpha =
                p.alpha + 0.08;

            ctx.beginPath();

            ctx.arc(
                drawX,
                p.y,
                p.r,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.globalAlpha = 1;

        requestAnimationFrame(draw);
    }

    draw();
}


/* =========================================================
   CUSTOM CURSOR — STATE SYSTEM
========================================================= */

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

let rx = mx;
let ry = my;

const dot = $('#cursorDot');
const ring = $('#cursorRing');
const label = $('#cursorLabel');


/*
   Các trạng thái cursor
*/

const cursorStates = {
    default: {
        text: '',
        size: 38,
        className: 'state-default'
    },

    open: {
        text: 'OPEN',
        size: 56,
        className: 'state-open'
    },

    view: {
        text: 'VIEW',
        size: 62,
        className: 'state-view'
    },

    skill: {
        text: 'SKILL',
        size: 60,
        className: 'state-skill'
    },

    play: {
        text: 'PLAY',
        size: 58,
        className: 'state-play'
    },

    next: {
        text: 'NEXT',
        size: 54,
        className: 'state-next'
    },

    prev: {
        text: 'PREV',
        size: 54,
        className: 'state-prev'
    },

    color: {
        text: 'COLOR',
        size: 64,
        className: 'state-color'
    },

    theme: {
        text: 'THEME',
        size: 60,
        className: 'state-theme'
    },

    sound: {
        text: 'SOUND',
        size: 60,
        className: 'state-sound'
    },

    copy: {
        text: 'COPY',
        size: 56,
        className: 'state-copy'
    },

    social: {
        text: 'SOCIAL',
        size: 64,
        className: 'state-social'
    }
};


function setCursorState(stateName = 'default') {
    const state =
        cursorStates[stateName] ||
        cursorStates.default;

    if (ring) {
        Object.values(cursorStates).forEach(
            (item) => {
                ring.classList.remove(
                    item.className
                );
            }
        );

        ring.classList.add(
            state.className
        );

        ring.style.width =
            state.size + 'px';

        ring.style.height =
            state.size + 'px';
    }

    if (label) {
        label.textContent =
            state.text;

        label.style.opacity =
            state.text
                ? '1'
                : '0';
    }
}


window.addEventListener(
    'mousemove',
    (e) => {
        mx = e.clientX;
        my = e.clientY;

        if (dot) {
            dot.style.left =
                mx + 'px';

            dot.style.top =
                my + 'px';
        }

        if (label) {
            label.style.left =
                mx + 'px';

            label.style.top =
                my + 'px';
        }
    }
);


function cursorLoop() {
    rx +=
        (mx - rx) *
        0.18;

    ry +=
        (my - ry) *
        0.18;

    if (ring) {
        ring.style.left =
            rx + 'px';

        ring.style.top =
            ry + 'px';
    }

    requestAnimationFrame(
        cursorLoop
    );
}

cursorLoop();


/*
   Xác định state dựa vào element
*/

function getCursorState(element) {

    if (
        element.matches(
            '#playlistPlay'
        )
    ) {
        return 'play';
    }

    if (
        element.matches(
            '#playlistNext'
        )
    ) {
        return 'next';
    }

    if (
        element.matches(
            '#playlistPrev'
        )
    ) {
        return 'prev';
    }

    if (
        element.matches(
            '#colorWheel'
        )
    ) {
        return 'color';
    }

    if (
        element.matches(
            '#themeBtn'
        )
    ) {
        return 'theme';
    }

    if (
        element.matches(
            '#soundBtn'
        )
    ) {
        return 'sound';
    }

    if (
        element.matches(
            '.copy-btn'
        )
    ) {
        return 'copy';
    }

    if (
        element.matches(
            '.skill-node'
        )
    ) {
        return 'skill';
    }

    if (
        element.matches(
            '.project-card'
        )
    ) {
        return 'view';
    }

    if (
        element.matches(
            '.social-card'
        )
    ) {
        return 'social';
    }

    if (
        element.matches(
            '.tilt'
        )
    ) {
        return 'view';
    }

    if (
        element.matches(
            'a'
        )
    ) {
        return 'open';
    }

    if (
        element.matches(
            'button'
        )
    ) {
        return 'open';
    }

    return 'default';
}


/*
   Hover state
*/

$$(
    'a, button, .tilt, .social-card, .skill-node, .project-card, .copy-btn, #colorWheel'
).forEach(
    (el) => {

        el.addEventListener(
            'mouseenter',
            () => {

                setCursorState(
                    getCursorState(el)
                );

            }
        );

        el.addEventListener(
            'mouseleave',
            () => {

                setCursorState(
                    'default'
                );

            }
        );
    }
);


setCursorState('default');


/* =========================================================
   SCROLL REVEAL — 2 CHIỀU
========================================================= */

const revealElements =
    $$('.reveal');

let lastScrollY =
    window.scrollY;

let scrollDirection =
    'down';


window.addEventListener(
    'scroll',
    () => {

        const currentY =
            window.scrollY;

        if (
            currentY >
            lastScrollY
        ) {
            scrollDirection =
                'down';
        }

        if (
            currentY <
            lastScrollY
        ) {
            scrollDirection =
                'up';
        }

        lastScrollY =
            currentY;

    },
    {
        passive: true
    }
);


revealElements.forEach(
    (el) => {

        el.classList.remove(
            'visible'
        );

        el.classList.remove(
            'reveal-from-top'
        );

        el.classList.remove(
            'reveal-from-bottom'
        );

        el.classList.add(
            'reveal-ready'
        );

    }
);


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    const el =
                        entry.target;

                    if (
                        entry.isIntersecting
                    ) {

                        el.classList.remove(
                            'reveal-from-top',
                            'reveal-from-bottom'
                        );

                        if (
                            scrollDirection ===
                            'down'
                        ) {

                            el.classList.add(
                                'reveal-from-bottom'
                            );

                        } else {

                            el.classList.add(
                                'reveal-from-top'
                            );

                        }

                        requestAnimationFrame(
                            () => {

                                requestAnimationFrame(
                                    () => {

                                        el.classList.add(
                                            'visible'
                                        );

                                    }
                                );

                            }
                        );

                    } else {

                        el.classList.remove(
                            'visible'
                        );

                    }
                }
            );
        },
        {
            threshold: 0.08,
            rootMargin:
                '-4% 0px -8% 0px'
        }
    );


revealElements.forEach(
    (el) => {

        revealObserver.observe(
            el
        );

    }
);


/* =========================================================
   SCROLL PROGRESS
========================================================= */

window.addEventListener(
    'scroll',
    () => {

        const progress =
            $('#progress');

        const topbar =
            $('#topbar');

        const h =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        if (
            progress &&
            h > 0
        ) {

            progress.style.height =
                (
                    window.scrollY /
                    h *
                    100
                ) + '%';

        }

        if (topbar) {

            topbar.style.boxShadow =
                window.scrollY > 40
                    ? '0 16px 55px rgba(0,0,0,.34)'
                    : 'inset 0 1px 0 rgba(255,255,255,.08),var(--shadow)';

        }

    }
);


/* =========================================================
   3D TILT
========================================================= */

$$('.tilt').forEach(
    (card) => {

        card.addEventListener(
            'mousemove',
            (e) => {

                const r =
                    card.getBoundingClientRect();

                const x =
                    (
                        e.clientX -
                        r.left
                    ) /
                    r.width -
                    0.5;

                const y =
                    (
                        e.clientY -
                        r.top
                    ) /
                    r.height -
                    0.5;

                card.style.transform = `
                    perspective(900px)
                    rotateY(${x * 9}deg)
                    rotateX(${y * -9}deg)
                    translateY(-4px)
                `;

            }
        );

        card.addEventListener(
            'mouseleave',
            () => {
                card.style.transform = '';
            }
        );

    }
);


/* =========================================================
   MAGNETIC
========================================================= */

$$('.magnetic').forEach(
    (el) => {

        el.addEventListener(
            'mousemove',
            (e) => {

                const r =
                    el.getBoundingClientRect();

                const x =
                    (
                        e.clientX -
                        (
                            r.left +
                            r.width / 2
                        )
                    ) *
                    0.08;

                const y =
                    (
                        e.clientY -
                        (
                            r.top +
                            r.height / 2
                        )
                    ) *
                    0.08;

                el.style.transform =
                    `translate(${x}px, ${y}px)`;

            }
        );

        el.addEventListener(
            'mouseleave',
            () => {
                el.style.transform = '';
            }
        );

    }
);


/* =========================================================
   SKILLS
========================================================= */

const skills = {

    web: [
        'WEB',
        'c++ - chatgpt - claude',
        '94%'
    ],

    design: [
        'LẬP TRÌNH',
        'C++ · HTML · CSS · JavaScript',
        '89%'
    ],

    motion: [
        'LẬP TRÌNH THI ĐẤU',
        'Thuật toán · tư duy logic · giải thuật',
        '86%'
    ],

    photo: [
        'ĐẠP XE',
        'Khám phá · thư giãn · vận động',
        '82%'
    ],

    content: [
        'CHATGPT',
        'AI · ChatGPT · Claude · AI tools',
        '91%'
    ]

};


$$('.skill-node').forEach(
    (node) => {

        node.addEventListener(
            'pointerdown',
            (event) => {
                event.stopPropagation();
            }
        );

        node.addEventListener(
            'click',
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                const skill =
                    skills[
                        node.dataset.skill
                    ];

                if (!skill) {
                    return;
                }

                $$('.skill-node')
                    .forEach(
                        (item) => {

                            item.classList.remove(
                                'active'
                            );

                        }
                    );

                node.classList.add(
                    'active'
                );

                const title =
                    $('#skillTitle');

                const text =
                    $('#skillText');

                const percent =
                    $('#skillPercent');

                const bar =
                    $('#skillBar');

                if (title) {
                    title.textContent =
                        skill[0];
                }

                if (text) {
                    text.textContent =
                        skill[1];
                }

                if (percent) {
                    percent.textContent =
                        skill[2];
                }

                if (bar) {
                    bar.style.width =
                        skill[2];
                }

            }
        );

    }
);


/* =========================================================
   COPY
========================================================= */

$$('.copy-btn').forEach(
    (btn) => {

        btn.addEventListener(
            'click',
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(
                            btn.dataset.copy
                        );

                    const toast =
                        $('#toast');

                    if (toast) {

                        toast.classList.add(
                            'show'
                        );

                        setTimeout(
                            () => {

                                toast.classList.remove(
                                    'show'
                                );

                            },
                            1500
                        );

                    }

                } catch (error) {

                    console.error(
                        'Copy failed:',
                        error
                    );

                }

            }
        );

    }
);


/* =========================================================
   MUSIC PLAYER + VISUALIZER
========================================================= */

const playBtn =
    $('#playlistPlay');

const prevBtn =
    $('#playlistPrev');

const nextBtn =
    $('#playlistNext');

const audioPlayer =
    $('#playlistAudio');

const musicTitle =
    $('#playlistTitle');

const musicArtist =
    $('#playlistArtist');

const musicCount =
    $('#playlistCount');

const waveBars =
    $$('#playlistWave i');


/* =========================================================
   PLAYLIST — GIỮ NGUYÊN
========================================================= */

const playlist = [

    {
        title: '2gsang',
        artist: 'Obito',
        src: 'music/2gsang.mp3'
    },

    {
        title: 'Cảm Ơn',
        artist: 'MCK',
        src: 'music/camon.mp3'
    },

    {
        title: 'Túy ÂM',
        artist: 'Masew',
        src: 'music/TN.mp3'
    },

    {
        title: 'The Night',
        artist: 'Avicii',
        src: 'music/tuyam.mp3'
    }

];

let currentSong = 0;


/* =========================================================
   VISUALIZER
========================================================= */

let visualizerFrame = null;
let visualizerTime = 0;


function animateVisualizer() {

    if (!audioPlayer || audioPlayer.paused) {
        cancelAnimationFrame(
            visualizerFrame
        );

        visualizerFrame = null;

        return;
    }


    visualizerTime += 0.14;


    waveBars.forEach(
        (bar, index) => {

            const wave =
                Math.sin(
                    visualizerTime +
                    index * 0.65
                );

            const wave2 =
                Math.sin(
                    visualizerTime * 1.7 +
                    index * 0.45
                );

            const height =
                5 +
                (
                    (wave + 1) / 2
                ) * 15 +
                (
                    (wave2 + 1) / 2
                ) * 8;


            bar.style.height =
                `${height}px`;

            bar.style.opacity =
                0.55 +
                (
                    (wave + 1) / 2
                ) * 0.45;

        }
    );


    visualizerFrame =
        requestAnimationFrame(
            animateVisualizer
        );
}


function startVisualizer() {

    if (visualizerFrame) {
        cancelAnimationFrame(
            visualizerFrame
        );
    }

    visualizerTime = 0;

    animateVisualizer();
}


function stopVisualizer() {

    if (visualizerFrame) {

        cancelAnimationFrame(
            visualizerFrame
        );

        visualizerFrame = null;
    }


    waveBars.forEach(
        (bar) => {

            bar.style.height =
                '';

            bar.style.opacity =
                '';

        }
    );

}


/* =========================================================
   PLAY / PAUSE UI
========================================================= */

function setPlayingUI() {

    if (playBtn) {

        playBtn.textContent =
            '❚❚';

        playBtn.classList.add(
            'playing'
        );
    }

    startVisualizer();
}


function setPausedUI() {

    if (playBtn) {

        playBtn.textContent =
            '▶';

        playBtn.classList.remove(
            'playing'
        );
    }

    stopVisualizer();
}


/* =========================================================
   LOAD SONG
========================================================= */

function loadSong(
    index,
    autoPlay = false
) {

    if (
        !playlist.length ||
        !audioPlayer
    ) {
        return;
    }


    currentSong =
        (
            index +
            playlist.length
        ) %
        playlist.length;


    const song =
        playlist[currentSong];


    audioPlayer.src =
        song.src;


    if (musicTitle) {

        musicTitle.textContent =
            song.title;

    }


    if (musicArtist) {

        musicArtist.textContent =
            song.artist;

    }


    if (musicCount) {

        musicCount.textContent =
            String(
                currentSong + 1
            ).padStart(
                2,
                '0'
            ) +
            ' / ' +
            String(
                playlist.length
            ).padStart(
                2,
                '0'
            );

    }


    stopVisualizer();


    if (autoPlay) {

        audioPlayer
            .play()
            .then(() => {

                setPlayingUI();

            })
            .catch(
                (error) => {

                    console.warn(
                        'Không thể phát nhạc:',
                        error
                    );

                }
            );

    }

}


/* =========================================================
   PLAY BUTTON
========================================================= */

if (
    playBtn &&
    audioPlayer
) {

    playBtn.addEventListener(
        'click',
        () => {

            if (
                audioPlayer.paused
            ) {

                audioPlayer
                    .play()
                    .then(() => {

                        setPlayingUI();

                    })
                    .catch(
                        (error) => {

                            console.warn(
                                'Không thể phát nhạc:',
                                error
                            );

                        }
                    );

            } else {

                audioPlayer.pause();

                setPausedUI();

            }

        }
    );

}


/* =========================================================
   NEXT
========================================================= */

if (
    nextBtn &&
    audioPlayer
) {

    nextBtn.addEventListener(
        'click',
        () => {

            loadSong(
                currentSong + 1,
                true
            );

        }
    );

}


/* =========================================================
   PREVIOUS
========================================================= */

if (
    prevBtn &&
    audioPlayer
) {

    prevBtn.addEventListener(
        'click',
        () => {

            loadSong(
                currentSong - 1,
                true
            );

        }
    );

}


/* =========================================================
   AUDIO EVENTS
========================================================= */

if (audioPlayer) {

    audioPlayer.addEventListener(
        'play',
        () => {

            setPlayingUI();

        }
    );


    audioPlayer.addEventListener(
        'pause',
        () => {

            setPausedUI();

        }
    );


    audioPlayer.addEventListener(
        'ended',
        () => {

            loadSong(
                currentSong + 1,
                true
            );

        }
    );

}


/* =========================================================
   INITIAL SONG
========================================================= */

loadSong(0);

/* =========================================================
   COLOR WHEEL
========================================================= */

const colorWheel =
    $('#colorWheel');


function applyThemeColor(
    hue
) {

    const normalizedHue =
        (
            (hue % 360) +
            360
        ) % 360;

    const purple =
        `hsl(${normalizedHue} 75% 65%)`;

    const pink =
        `hsl(${(normalizedHue + 35) % 360} 80% 75%)`;

    const cyan =
        `hsl(${(normalizedHue + 70) % 360} 85% 70%)`;

    document.documentElement.style.setProperty(
        '--purple',
        purple
    );

    document.documentElement.style.setProperty(
        '--pink',
        pink
    );

    document.documentElement.style.setProperty(
        '--cyan',
        cyan
    );

    document.documentElement.style.setProperty(
        '--theme-hue',
        normalizedHue
    );

}


if (colorWheel) {

    colorWheel.addEventListener(
        'click',
        (event) => {

            const rect =
                colorWheel.getBoundingClientRect();

            const centerX =
                rect.left +
                rect.width / 2;

            const centerY =
                rect.top +
                rect.height / 2;

            const x =
                event.clientX -
                centerX;

            const y =
                event.clientY -
                centerY;

            let angle =
                Math.atan2(
                    y,
                    x
                ) *
                180 /
                Math.PI;

            angle += 90;

            if (angle < 0) {
                angle += 360;
            }

            applyThemeColor(
                angle
            );

        }
    );


    colorWheel.addEventListener(
        'pointermove',
        (event) => {

            if (
                event.buttons !== 1
            ) {
                return;
            }

            const rect =
                colorWheel.getBoundingClientRect();

            const centerX =
                rect.left +
                rect.width / 2;

            const centerY =
                rect.top +
                rect.height / 2;

            const x =
                event.clientX -
                centerX;

            const y =
                event.clientY -
                centerY;

            let angle =
                Math.atan2(
                    y,
                    x
                ) *
                180 /
                Math.PI;

            angle += 90;

            if (angle < 0) {
                angle += 360;
            }

            applyThemeColor(
                angle
            );

        }
    );

}


/* =========================================================
   THEME 2 — NEBULA / AURORA
========================================================= */

let alt = false;

const themeBtn =
    $('#themeBtn');


function setTheme2(
    enabled
) {

    document.documentElement
        .classList.toggle(
            'theme-nebula',
            enabled
        );

    if (themeBtn) {

        themeBtn.classList.toggle(
            'active',
            enabled
        );

    }

}


if (themeBtn) {

    themeBtn.addEventListener(
        'click',
        () => {

            alt = !alt;

            setTheme2(
                alt
            );

            const toast =
                $('#toast');

            if (toast) {

                toast.textContent =
                    alt
                        ? 'Nebula theme ✦'
                        : 'Original theme';

                toast.classList.add(
                    'show'
                );

                setTimeout(
                    () => {

                        toast.classList.remove(
                            'show'
                        );

                        toast.textContent =
                            'Copied ✓';

                    },
                    1200
                );

            }

        }
    );

}


/* =========================================================
   SOUND BUTTON
========================================================= */

const soundBtn =
    $('#soundBtn');

if (soundBtn) {

    soundBtn.addEventListener(
        'click',
        () => {

            soundBtn.classList.toggle(
                'active'
            );

            const toast =
                $('#toast');

            if (!toast) {
                return;
            }

            toast.textContent =
                soundBtn.classList.contains(
                    'active'
                )
                    ? 'Sound ON'
                    : 'Sound OFF';

            toast.classList.add(
                'show'
            );

            setTimeout(
                () => {

                    toast.classList.remove(
                        'show'
                    );

                    toast.textContent =
                        'Copied ✓';

                },
                1200
            );

        }
    );

}


/* =========================================================
   YEAR
========================================================= */

const year =
    $('#year');

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   RIPPLE
========================================================= */

window.addEventListener(
    'click',
    (e) => {

        if (
            !e.target.closest(
                'button, a'
            )
        ) {
            return;
        }

        const ripple =
            document.createElement(
                'span'
            );

        ripple.className =
            'ripple';

        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 10px;
            height: 10px;
            border: 1px solid rgba(220,190,255,.5);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 90;
            animation: ripple .7s ease-out forwards;
        `;

        document.body.appendChild(
            ripple
        );

        setTimeout(
            () => {
                ripple.remove();
            },
            700
        );

    }
);
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
   BACKGROUND
========================================================= */

const canvas = $('#space');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let W;
    let H;
    let dpr;
    let stars = [];

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
    }

    resize();

    window.addEventListener(
        'resize',
        resize
    );

    function draw() {
        ctx.clearRect(
            0,
            0,
            W,
            H
        );

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

        ctx.globalAlpha = 1;

        requestAnimationFrame(draw);
    }

    draw();
}


/* =========================================================
   CUSTOM CURSOR
========================================================= */

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

let rx = mx;
let ry = my;

const dot = $('#cursorDot');
const ring = $('#cursorRing');
const label = $('#cursorLabel');

window.addEventListener(
    'mousemove',
    (e) => {
        mx = e.clientX;
        my = e.clientY;

        if (dot) {
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        }

        if (label) {
            label.style.left = mx + 'px';
            label.style.top = my + 'px';
        }
    }
);

function cursorLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;

    if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
    }

    requestAnimationFrame(
        cursorLoop
    );
}

cursorLoop();


$$(
    'a, button, .tilt, .social-card'
).forEach(
    (el) => {

        el.addEventListener(
            'mouseenter',
            () => {

                if (ring) {
                    ring.style.width = '58px';
                    ring.style.height = '58px';
                }

                if (label) {
                    label.style.opacity = '1';
                }
            }
        );

        el.addEventListener(
            'mouseleave',
            () => {

                if (ring) {
                    ring.style.width = '38px';
                    ring.style.height = '38px';
                }

                if (label) {
                    label.style.opacity = '0';
                }
            }
        );

    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const io =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {
                        entry.target.classList.add(
                            'visible'
                        );
                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );

$$('.reveal').forEach(
    (el) => io.observe(el)
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
                    window.scrollY / h *
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
                    (e.clientX - r.left) /
                    r.width -
                    0.5;

                const y =
                    (e.clientY - r.top) /
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
                    ) * 0.08;

                const y =
                    (
                        e.clientY -
                        (
                            r.top +
                            r.height / 2
                        )
                    ) * 0.08;

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
   MUSIC PLAYER
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


const playlist = [

    {
        title: 'Bài hát số 1',
        artist: 'Nghệ sĩ 1',
        src: 'music/bai1.mp3'
    },

    {
        title: 'Bài hát số 2',
        artist: 'Nghệ sĩ 2',
        src: 'music/bai2.mp3'
    },

    {
        title: 'Bài hát số 3',
        artist: 'Nghệ sĩ 3',
        src: 'music/bai3.mp3'
    },

    {
        title: 'Bài hát số 4',
        artist: 'Nghệ sĩ 4',
        src: 'music/bai4.mp3'
    }

];

let currentSong = 0;


function setPlayingUI() {

    if (playBtn) {
        playBtn.textContent = '❚❚';
    }

    waveBars.forEach(
        (bar, index) => {

            bar.style.animation =
                `bar .7s ease-in-out infinite alternate ${index * -0.08}s`;

        }
    );

}


function setPausedUI() {

    if (playBtn) {
        playBtn.textContent = '▶';
    }

    waveBars.forEach(
        (bar) => {
            bar.style.animation = '';
        }
    );

}


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
            ).padStart(2, '0') +
            ' / ' +
            String(
                playlist.length
            ).padStart(2, '0');

    }

    setPausedUI();

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


if (audioPlayer) {

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
        ((hue % 360) + 360) % 360;

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
                Math.atan2(y, x) *
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
                Math.atan2(y, x) *
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


function setTheme2(enabled) {

    document.documentElement.classList.toggle(
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


/*
   Theme 2 không dùng filter cho body.
   Vì filter trên body sẽ làm cursor fixed bị lỗi
   khi scroll.
*/

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
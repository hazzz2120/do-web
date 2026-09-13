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


        /* STARS */

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

            ctx.fillStyle =
                '#d8c7ff';

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


        /* FLOATING PARTICLES */

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

            ctx.fillStyle =
                glow;

            ctx.globalAlpha =
                1;

            ctx.beginPath();

            ctx.arc(
                drawX,
                p.y,
                p.r * 4,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                '#eadfff';

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

        requestAnimationFrame(
            draw
        );

    }

    draw();

}


/* =========================================================
   HACKER / MATRIX SYSTEM
========================================================= */

const hackerLayer =
    document.createElement('div');

hackerLayer.className =
    'hacker-layer';

hackerLayer.setAttribute(
    'aria-hidden',
    'true'
);

hackerLayer.innerHTML = `
    <canvas id="matrixRain"></canvas>

    <div class="hacker-grid"></div>

    <div class="hacker-scanline"></div>

    <div class="hacker-code-stream hacker-code-left"></div>

    <div class="hacker-code-stream hacker-code-right"></div>

    <div class="hacker-status">
        <span>SYS://ONLINE</span>
        <span id="hackerClock">00:00:00</span>
    </div>

    <div class="hacker-terminal-tag">
        root@my.world:~$
    </div>
`;

document.body.appendChild(
    hackerLayer
);


const matrixCanvas =
    $('#matrixRain');


const matrixCtx =
    matrixCanvas
        ? matrixCanvas.getContext('2d')
        : null;


let matrixW = 0;
let matrixH = 0;
let matrixDpr = 1;

let matrixColumns = [];

let matrixFrame =
    null;


const matrixChars =
    '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';


function resizeMatrix() {

    if (!matrixCanvas) {
        return;
    }

    matrixDpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    matrixW =
        window.innerWidth;

    matrixH =
        window.innerHeight;

    matrixCanvas.width =
        matrixW * matrixDpr;

    matrixCanvas.height =
        matrixH * matrixDpr;

    matrixCanvas.style.width =
        matrixW + 'px';

    matrixCanvas.style.height =
        matrixH + 'px';


    matrixCtx.setTransform(
        matrixDpr,
        0,
        0,
        matrixDpr,
        0,
        0
    );


    const fontSize =
        window.innerWidth < 700
            ? 13
            : 18;


    const count =
        Math.ceil(
            matrixW /
            fontSize
        );


    matrixColumns =
        Array.from(
            {
                length:
                    count
            },
            () => ({

                y:
                    Math.random() *
                    matrixH,

                speed:
                    Math.random() *
                    2.3 +
                    0.7,

                length:
                    Math.floor(
                        Math.random() *
                        13
                    ) + 5,

                alpha:
                    Math.random() *
                    0.30 +
                    0.08,

                size:
                    fontSize

            })
        );

}


resizeMatrix();

window.addEventListener(
    'resize',
    resizeMatrix
);


function drawMatrix() {

    if (!matrixCtx) {
        return;
    }


    matrixCtx.fillStyle =
        'rgba(0, 4, 1, .075)';


    matrixCtx.fillRect(
        0,
        0,
        matrixW,
        matrixH
    );


    const now =
        Date.now();


    matrixCtx.font =
        `${window.innerWidth < 700 ? 13 : 18}px "Courier New", monospace`;


    matrixColumns.forEach(
        (column, index) => {

            column.y +=
                column.speed;


            if (
                column.y >
                matrixH +
                column.length *
                column.size
            ) {

                column.y =
                    -Math.random() *
                    matrixH *
                    0.6;

                column.speed =
                    Math.random() *
                    2.3 +
                    0.7;

            }


            for (
                let i = 0;
                i < column.length;
                i++
            ) {

                const y =
                    column.y -
                    i *
                    column.size;


                if (
                    y < -20 ||
                    y >
                    matrixH +
                    20
                ) {

                    continue;

                }


                const fade =
                    1 -
                    i /
                    column.length;


                const alpha =
                    column.alpha *
                    fade;


                let char =
                    matrixChars[
                        Math.floor(
                            Math.random() *
                            matrixChars.length
                        )
                    ];


                if (
                    Math.random() < .025
                ) {

                    char =
                        '<';

                }


                if (
                    Math.random() < .02
                ) {

                    char =
                        '>';

                }


                if (
                    i === 0
                ) {

                    matrixCtx.fillStyle =
                        `rgba(220,255,220,${Math.min(
                            0.9,
                            alpha + .3
                        )})`;

                } else {

                    matrixCtx.fillStyle =
                        `rgba(57,255,20,${alpha})`;

                }


                const drift =
                    Math.sin(
                        now / 1200 +
                        index
                    ) * 1.3;


                matrixCtx.fillText(
                    char,
                    index *
                        column.size +
                        drift,
                    y
                );

            }

        }
    );


    matrixFrame =
        requestAnimationFrame(
            drawMatrix
        );

}


drawMatrix();


/* =========================================================
   HACKER CODE STREAMS
========================================================= */

const codeStreamLeft =
    $('.hacker-code-left');

const codeStreamRight =
    $('.hacker-code-right');


const codeChars = [

    'C++',
    'HTML',
    'CSS',
    'JS',
    'AI',
    '{}',
    '</>',
    '&&',
    '||',
    'null',
    'true',
    'false',
    'sudo',
    'root',
    'git',
    'npm',
    'build',
    'compile',
    'system',
    'online',
    'MY.WORLD',
    'localhost',
    '0x01',
    '0xFF',
    '010101'

];


function createCodeFragment(
    side
) {

    const item =
        document.createElement(
            'div'
        );


    item.className =
        'hacker-code-fragment';


    item.textContent =
        codeChars[
            Math.floor(
                Math.random() *
                codeChars.length
            )
        ];


    item.style.left =
        (
            Math.random() *
            85
        ) + '%';


    item.style.animationDuration =
        (
            Math.random() * 7 +
            5
        ) + 's';


    item.style.animationDelay =
        (
            Math.random() * -8
        ) + 's';


    item.style.opacity =
        (
            Math.random() *
            .45 +
            .10
        );


    item.classList.add(
        side === 'left'
            ? 'code-fall'
            : 'code-rise'
    );


    return item;

}


if (
    codeStreamLeft &&
    codeStreamRight
) {

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        codeStreamLeft.appendChild(
            createCodeFragment(
                'left'
            )
        );


        codeStreamRight.appendChild(
            createCodeFragment(
                'right'
            )
        );

    }

}


/* =========================================================
   HACKER CLOCK
========================================================= */

const hackerClock =
    $('#hackerClock');


function updateHackerClock() {

    if (!hackerClock) {
        return;
    }

    const now =
        new Date();


    hackerClock.textContent =
        [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
        ]
            .map(
                (n) =>
                    String(n)
                        .padStart(
                            2,
                            '0'
                        )
            )
            .join(':');

}


updateHackerClock();


setInterval(
    updateHackerClock,
    1000
);


/* =========================================================
   CUSTOM CURSOR — STATE SYSTEM
========================================================= */

let mx =
    window.innerWidth / 2;

let my =
    window.innerHeight / 2;

let rx =
    mx;

let ry =
    my;


const dot =
    $('#cursorDot');

const ring =
    $('#cursorRing');

const label =
    $('#cursorLabel');


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
        text: 'RANDOM',
        size: 64,
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
    },

    map: {
        text: 'MAP',
        size: 56,
        className: 'state-map'
    }

};


function setCursorState(
    stateName = 'default'
) {

    const state =
        cursorStates[stateName] ||
        cursorStates.default;


    if (ring) {

        Object.values(
            cursorStates
        ).forEach(
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

        mx =
            e.clientX;

        my =
            e.clientY;


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


function getCursorState(
    element
) {

    if (
        element.matches(
            '#worldMapBtn'
        )
    ) {
        return 'map';
    }


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


setCursorState(
    'default'
);


/* =========================================================
   WORLD MAP
========================================================= */

const worldMapBtn =
    $('#worldMapBtn');


const worldMap =
    document.createElement(
        'div'
    );


worldMap.className =
    'world-map';


worldMap.innerHTML = `

    <div class="world-map-inner">

        <div class="world-map-grid"></div>

        <div class="world-map-header">

            <div class="world-map-title">

                <strong>
                    MY.WORLD MAP
                </strong>

                <span>
                    Explore my universe
                </span>

            </div>


            <button
                type="button"
                class="world-map-close"
                id="worldMapClose"
            >
                ×
            </button>

        </div>


        <div class="world-universe">

            <div
                class="world-orbit world-orbit-1"
            ></div>

            <div
                class="world-orbit world-orbit-2"
            ></div>


            <div
                class="world-line world-line-1"
            ></div>

            <div
                class="world-line world-line-2"
            ></div>

            <div
                class="world-line world-line-3"
            ></div>

            <div
                class="world-line world-line-4"
            ></div>


            <div class="world-core">

                <strong>
                    MY.WORLD
                </strong>

                <span>
                    PERSONAL UNIVERSE
                </span>

            </div>


            <button
                type="button"
                class="world-node world-node-home"
                data-world-target="home"
            >
                <span>HOME</span>
                <small>origin</small>
            </button>


            <button
                type="button"
                class="world-node world-node-about"
                data-world-target="about"
            >
                <span>ABOUT</span>
                <small>my story</small>
            </button>


            <button
                type="button"
                class="world-node world-node-skills"
                data-world-target="skills"
            >
                <span>SKILLS</span>
                <small>abilities</small>
            </button>


            <button
                type="button"
                class="world-node world-node-projects"
                data-world-target="projects"
            >
                <span>PROJECTS</span>
                <small>my work</small>
            </button>


            <button
                type="button"
                class="world-node world-node-links"
                data-world-target="links"
            >
                <span>LINKS</span>
                <small>social</small>
            </button>


            <button
                type="button"
                class="world-node world-node-contact"
                data-world-target="contact"
            >
                <span>CONTACT</span>
                <small>connect</small>
            </button>

        </div>


        <div class="world-map-hint">
            SELECT A PLANET TO EXPLORE
        </div>

    </div>

`;


document.body.appendChild(
    worldMap
);


const worldMapClose =
    $('#worldMapClose');


function openWorldMap() {

    worldMap.classList.add(
        'open'
    );


    document.documentElement.classList.add(
        'world-map-open'
    );


    if (worldMapBtn) {

        worldMapBtn.classList.add(
            'active'
        );

    }


    setCursorState(
        'default'
    );

}


function closeWorldMap() {

    worldMap.classList.remove(
        'open'
    );


    document.documentElement.classList.remove(
        'world-map-open'
    );


    if (worldMapBtn) {

        worldMapBtn.classList.remove(
            'active'
        );

    }


    setCursorState(
        'default'
    );

}


if (worldMapBtn) {

    worldMapBtn.addEventListener(
        'click',
        openWorldMap
    );

}


if (worldMapClose) {

    worldMapClose.addEventListener(
        'click',
        closeWorldMap
    );

}


worldMap.addEventListener(
    'click',
    (event) => {

        if (
            event.target ===
            worldMap
        ) {

            closeWorldMap();

        }

    }
);


$$(
    '[data-world-target]'
).forEach(
    (node) => {

        node.addEventListener(
            'mouseenter',
            () => {

                if (ring) {

                    ring.classList.add(
                        'state-map'
                    );

                    ring.style.width =
                        '60px';

                    ring.style.height =
                        '60px';

                }


                if (label) {

                    label.textContent =
                        node
                            .querySelector(
                                'span'
                            )
                            ?.textContent ||
                        'GO';

                    label.style.opacity =
                        '1';

                }

            }
        );


        node.addEventListener(
            'mouseleave',
            () => {

                setCursorState(
                    'default'
                );

            }
        );


        node.addEventListener(
            'click',
            () => {

                const targetId =
                    node.dataset.worldTarget;


                const target =
                    document.getElementById(
                        targetId
                    );


                closeWorldMap();


                if (target) {

                    setTimeout(
                        () => {

                            target.scrollIntoView(
                                {
                                    behavior:
                                        'smooth',

                                    block:
                                        'start'
                                }
                            );

                        },
                        250
                    );

                }

            }
        );

    }
);


window.addEventListener(
    'keydown',
    (event) => {

        if (
            event.key === 'Escape' &&
            worldMap.classList.contains(
                'open'
            )
        ) {

            closeWorldMap();

        }

    }
);


/* =========================================================
   SECTION TRACKER — DOTS ONLY
========================================================= */

const sectionData = [
    {
        id: 'home',
        label: 'HOME'
    },
    {
        id: 'about',
        label: 'ABOUT'
    },
    {
        id: 'skills',
        label: 'SKILLS'
    },
    {
        id: 'projects',
        label: 'PROJECTS'
    },
    {
        id: 'links',
        label: 'LINKS'
    },
    {
        id: 'contact',
        label: 'CONTACT'
    }
];


const sectionTracker =
    document.createElement(
        'div'
    );


sectionTracker.className =
    'section-tracker';


sectionTracker.setAttribute(
    'aria-label',
    'Section navigation'
);


sectionTracker.innerHTML =
    sectionData
        .map(
            (section, index) => `
                <button
                    type="button"
                    class="section-dot ${index === 0 ? 'active' : ''}"
                    data-section-target="${section.id}"
                    aria-label="${section.label}"
                    title="${section.label}"
                >
                    <span class="section-dot-point"></span>
                    <strong>${section.label}</strong>
                </button>
            `
        )
        .join('');


document.body.appendChild(
    sectionTracker
);


const sectionDots =
    $$('.section-dot');


const trackedSections =
    sectionData
        .map(
            (item) =>
                document.getElementById(
                    item.id
                )
        )
        .filter(Boolean);


function setActiveSection(
    id
) {

    sectionDots.forEach(
        (dot) => {

            dot.classList.toggle(
                'active',
                dot.dataset.sectionTarget === id
            );

        }
    );

}


sectionDots.forEach(
    (dot) => {

        dot.addEventListener(
            'mouseenter',
            () => {

                if (label) {

                    label.textContent =
                        dot
                            .dataset
                            .sectionTarget
                            ?.toUpperCase() ||
                        '';

                    label.style.opacity =
                        '1';

                }


                if (ring) {

                    ring.style.width =
                        '54px';

                    ring.style.height =
                        '54px';

                }

            }
        );


        dot.addEventListener(
            'mouseleave',
            () => {

                setCursorState(
                    'default'
                );

            }
        );


        dot.addEventListener(
            'click',
            () => {

                const target =
                    document.getElementById(
                        dot.dataset.sectionTarget
                    );


                if (!target) {
                    return;
                }


                target.scrollIntoView(
                    {
                        behavior:
                            'smooth',

                        block:
                            'start'
                    }
                );


                setActiveSection(
                    dot.dataset.sectionTarget
                );

            }
        );

    }
);


/*
   Xác định section hiện tại
*/

const sectionObserver =
    new IntersectionObserver(
        (entries) => {

            const visible =
                entries
                    .filter(
                        (entry) =>
                            entry.isIntersecting
                    )
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    )[0];


            if (visible) {

                setActiveSection(
                    visible.target.id
                );

            }

        },
        {
            threshold: [
                0.15,
                0.35,
                0.55,
                0.75
            ],

            rootMargin:
                '-15% 0px -35% 0px'
        }
    );


trackedSections.forEach(
    (section) => {

        sectionObserver.observe(
            section
        );

    }
);


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

        } else if (
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
            threshold:
                0.08,

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

/*
   Không dùng thanh bar cũ nữa.
   Section Tracker bên trên đã thay thế.
*/

window.addEventListener(
    'scroll',
    () => {

        const topbar =
            $('#topbar');


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

                card.style.transform =
                    '';

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

                el.style.transform =
                    '';

            }
        );

    }
);


/* =========================================================
   SKILLS — GIỮ NGUYÊN
========================================================= */

const skills = {

    web: [
        'WEB',
        'gemini - chatgpt - claude',
        '95%'
    ],

    design: [
        'LẬP TRÌNH',
        'C++ · HTML · CSS · JavaScript',
        '20%'
    ],

    motion: [
        'LẬP TRÌNH THI ĐẤU',
        'Thuật toán · tư duy logic · giải thuật',
        '15%'
    ],

    photo: [
        'ĐẠP XE',
        'Khám phá · thư giãn · vận động',
        '67%'
    ],

    content: [
        'CHATGPT',
        'AI · ChatGPT · Claude · AI tools',
        '100%'
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
        src: 'music/TN.mp3'
    }

];


let currentSong = 0;

let visualizerFrame =
    null;

let visualizerTime =
    0;


/* =========================================================
   MUSIC VISUALIZER
========================================================= */

function animateVisualizer() {

    if (
        !audioPlayer ||
        audioPlayer.paused
    ) {

        cancelAnimationFrame(
            visualizerFrame
        );

        visualizerFrame =
            null;

        return;

    }


    visualizerTime +=
        0.14;


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
                    (wave + 1) /
                    2
                ) * 15 +
                (
                    (wave2 + 1) /
                    2
                ) * 8;


            bar.style.height =
                `${height}px`;


            bar.style.opacity =
                0.55 +
                (
                    (wave + 1) /
                    2
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


    visualizerTime =
        0;


    animateVisualizer();

}


function stopVisualizer() {

    if (visualizerFrame) {

        cancelAnimationFrame(
            visualizerFrame
        );

        visualizerFrame =
            null;

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


loadSong(0);


/* =========================================================
   RANDOM MUSIC — ◒
========================================================= */

const soundBtn =
    $('#soundBtn');


if (
    soundBtn &&
    audioPlayer &&
    playlist.length
) {

    soundBtn.addEventListener(
        'click',
        () => {

            let randomSong;


            do {

                randomSong =
                    Math.floor(
                        Math.random() *
                        playlist.length
                    );

            } while (
                playlist.length > 1 &&
                randomSong === currentSong
            );


            loadSong(
                randomSong,
                true
            );


            soundBtn.classList.add(
                'active'
            );


            const toast =
                $('#toast');


            if (toast) {

                const song =
                    playlist[randomSong];


                toast.textContent =
                    `▶ ${song.title}`;


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
                    1400
                );

            }

        }
    );

}


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


            angle +=
                90;


            if (angle < 0) {

                angle +=
                    360;

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


            angle +=
                90;


            if (angle < 0) {

                angle +=
                    360;

            }


            applyThemeColor(
                angle
            );

        }
    );

}


/* =========================================================
   THEME SYSTEM
   ORIGINAL → NEBULA → HACKER → ORIGINAL
========================================================= */

let themeMode = 0;

const themeBtn =
    $('#themeBtn');


function setThemeMode(
    mode
) {

    themeMode =
        (
            mode + 3
        ) % 3;


    document.documentElement.classList.remove(
        'theme-nebula',
        'theme-hacker'
    );


    if (
        themeMode === 1
    ) {

        document.documentElement.classList.add(
            'theme-nebula'
        );

    }


    if (
        themeMode === 2
    ) {

        document.documentElement.classList.add(
            'theme-hacker'
        );

    }


    if (themeBtn) {

        themeBtn.classList.toggle(
            'active',
            themeMode !== 0
        );

    }


    if (
        themeMode === 2
    ) {

        hackerLayer.classList.add(
            'active'
        );

    } else {

        hackerLayer.classList.remove(
            'active'
        );

    }

}


if (themeBtn) {

    themeBtn.addEventListener(
        'click',
        () => {

            setThemeMode(
                themeMode + 1
            );


            const toast =
                $('#toast');


            if (!toast) {
                return;
            }


            let message =
                'Original theme';


            if (
                themeMode === 1
            ) {

                message =
                    'Nebula theme ✦';

            }


            if (
                themeMode === 2
            ) {

                message =
                    'HACKER MODE // SYSTEM ONLINE';

            }


            toast.textContent =
                message;


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
                1400
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
            z-index: 10060;
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
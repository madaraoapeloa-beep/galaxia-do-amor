import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";


/* =========================================================
   ELEMENTOS
========================================================= */

const intro =
    document.getElementById("intro");

const introCode =
    document.getElementById("introCode");

const startButton =
    document.getElementById("startButton");

const galaxy =
    document.getElementById("galaxy");

const sceneContainer =
    document.getElementById("scene");

const memoryOverlay =
    document.getElementById("memoryOverlay");

const memoryImage =
    document.getElementById("memoryImage");

const memoryTitle =
    document.getElementById("memoryTitle");

const memoryText =
    document.getElementById("memoryText");

const closeMemory =
    document.getElementById("closeMemory");

const infoButton =
    document.getElementById("infoButton");

const musicButton =
    document.getElementById("musicButton");


/* =========================================================
   INTRO — CÓDIGOS
========================================================= */

const introCharacters =
    "01010101 00110101 ERROR LOVE HEART 404 { } [ ] < > / * + ♡";

let introString = "";

for (let i = 0; i < 6500; i++) {

    introString +=
        introCharacters[
            Math.floor(
                Math.random() *
                introCharacters.length
            )
        ];

}

introCode.textContent =
    introString;


/* =========================================================
   THREE.JS
========================================================= */

const scene =
    new THREE.Scene();


scene.fog =
    new THREE.FogExp2(
        0x010101,
        0.0010
    );


/* =========================================================
   CÂMERA
========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        52,
        window.innerWidth /
        window.innerHeight,
        0.1,
        3000
    );


camera.position.set(
    0,
    95,
    1100
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: false,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setClearColor(
    0x000000,
    1
);


sceneContainer.appendChild(
    renderer.domElement
);


/* =========================================================
   LUZES
========================================================= */

const ambientLight =
    new THREE.AmbientLight(
        0xfff2df,
        0.55
    );


scene.add(
    ambientLight
);


const pointLight =
    new THREE.PointLight(
        0xffddaa,
        1.8,
        2600,
        1.6
    );


pointLight.position.set(
    0,
    220,
    250
);


scene.add(
    pointLight
);


/* =========================================================
   PÓS-PROCESSAMENTO — BRILHO (BLOOM)
========================================================= */

const composer =
    new EffectComposer(
        renderer
    );


composer.addPass(
    new RenderPass(
        scene,
        camera
    )
);


const bloomPass =
    new UnrealBloomPass(
        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),
        0.55,
        0.4,
        0.32
    );


composer.addPass(
    bloomPass
);


/* =========================================================
   ESTADO
========================================================= */

let galaxyStarted = false;

let elapsed = 0;

let mouseX = 0;

let mouseY = 0;

let targetMouseX = 0;

let targetMouseY = 0;


/* =========================================================
   MOUSE
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        targetMouseX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        targetMouseY =
            (
                event.clientY /
                window.innerHeight
            ) * 2 - 1;

    }
);


/* =========================================================
   UTILITÁRIOS
========================================================= */

function random(min, max) {

    return (
        Math.random() *
        (max - min)
    ) + min;

}


function heartPoint(t) {

    return {

        x:
            16 *
            Math.pow(
                Math.sin(t),
                3
            ),

        y:
            13 *
                Math.cos(t)

            -
            5 *
                Math.cos(
                    2 * t
                )

            -
            2 *
                Math.cos(
                    3 * t
                )

            -
            Math.cos(
                4 * t
            )

    };

}


/* =========================================================
   TEXTURA DE BRILHO (GLOW)
========================================================= */

function createGlowTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 128;

    canvas.height = 128;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const gradient =
        ctx.createRadialGradient(
            64,
            64,
            0,
            64,
            64,
            64
        );


    gradient.addColorStop(
        0,
        "rgba(255,255,255,0.95)"
    );


    gradient.addColorStop(
        0.35,
        "rgba(255,200,220,0.45)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,150,190,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        128,
        128
    );


    return new THREE.CanvasTexture(
        canvas
    );

}


const glowTexture =
    createGlowTexture();


/* =========================================================
   TEXTURA DE PONTO (ESTRELAS/PARTÍCULAS)
========================================================= */

function createDotTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 64;

    canvas.height = 64;


    const ctx =
        canvas.getContext(
            "2d"
        );


    const gradient =
        ctx.createRadialGradient(
            32,
            32,
            0,
            32,
            32,
            32
        );


    gradient.addColorStop(
        0,
        "rgba(255,255,255,1)"
    );


    gradient.addColorStop(
        0.4,
        "rgba(255,255,255,0.55)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        64,
        64
    );


    return new THREE.CanvasTexture(
        canvas
    );

}


const dotTexture =
    createDotTexture();


/* =========================================================
   GRUPO PRINCIPAL
========================================================= */

const universe =
    new THREE.Group();

scene.add(
    universe
);


/* =========================================================
   ESTRELAS PROFUNDAS
========================================================= */

function createStars() {

    const count = 8500;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        const radius =
            Math.pow(
                Math.random(),
                0.45
            ) *
            1900;


        const angle =
            Math.random() *
            Math.PI *
            2;


        positions[i3] =
            Math.cos(angle) *
            radius;


        positions[i3 + 1] =
            random(
                -500,
                1000
            );


        positions[i3 + 2] =
            Math.sin(angle) *
            radius;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xd9b98b,

            size:
                1.7,

            transparent:
                true,

            opacity:
                0.72,

            depthWrite:
                false,

            sizeAttenuation:
                true

        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    universe.add(
        points
    );


    return points;

}


const stars =
    createStars();


/* =========================================================
   ESTRELAS PEQUENAS BRILHANTES
========================================================= */

function createTinyStars() {

    const count = 1800;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        positions[i3] =
            random(
                -1000,
                1000
            );


        positions[i3 + 1] =
            random(
                -350,
                800
            );


        positions[i3 + 2] =
            random(
                -900,
                800
            );

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xffe5b3,

            size:
                2.5,

            transparent:
                true,

            opacity:
                0.85,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    universe.add(
        points
    );


    return points;

}


const tinyStars =
    createTinyStars();


/* =========================================================
   CHÃO DE PARTÍCULAS
========================================================= */

function createFloor() {

    const count = 12000;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        const radius =
            Math.sqrt(
                Math.random()
            ) *
            1300;


        const angle =
            Math.random() *
            Math.PI *
            2;


        const x =
            Math.cos(angle) *
            radius;


        const z =
            Math.sin(angle) *
            radius;


        /*
           Ondulações suaves.
        */

        const wave =
            Math.sin(
                radius * 0.025
            ) *
            4;


        positions[i3] =
            x;


        positions[i3 + 1] =
            -170 +
            wave +
            random(
                -9,
                9
            );


        positions[i3 + 2] =
            z;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xcba66b,

            size:
                1.8,

            transparent:
                true,

            opacity:
                0.56,

            depthWrite:
                false

        });


    const floor =
        new THREE.Points(
            geometry,
            material
        );


    universe.add(
        floor
    );


    return floor;

}


const floor =
    createFloor();


/* =========================================================
   ÓRBITAS DE PARTÍCULAS
========================================================= */

function createOrbit(
    radius,
    height,
    particleCount,
    rotation
) {

    const positions =
        new Float32Array(
            particleCount * 3
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 =
            i * 3;


        const progress =
            i /
            particleCount;


        const angle =
            progress *
            Math.PI *
            2;


        const variation =
            random(
                -12,
                12
            );


        positions[i3] =
            Math.cos(angle) *
            (
                radius +
                variation
            );


        positions[i3 + 1] =
            height +
            random(
                -3,
                3
            );


        positions[i3 + 2] =
            Math.sin(angle) *
            (
                radius +
                variation
            );

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xf2d08a,

            size:
                2.2,

            transparent:
                true,

            opacity:
                0.60,

            depthWrite:
                false

        });


    const orbit =
        new THREE.Points(
            geometry,
            material
        );


    orbit.rotation.y =
        rotation;


    universe.add(
        orbit
    );


    return orbit;

}


const orbit1 =
    createOrbit(
        240,
        -135,
        1500,
        0
    );


const orbit2 =
    createOrbit(
        390,
        -140,
        1900,
        0.7
    );


const orbit3 =
    createOrbit(
        560,
        -145,
        2400,
        1.8
    );


const orbit4 =
    createOrbit(
        760,
        -150,
        2900,
        2.8
    );


/* =========================================================
   ESPIRAL CENTRAL
========================================================= */

function createCentralSpiral() {

    const count = 2800;

    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        const progress =
            i /
            count;


        const radius =
            15 +
            progress *
            260;


        const angle =
            progress *
            Math.PI *
            12;


        positions[i3] =
            Math.cos(angle) *
            radius;


        positions[i3 + 1] =
            -135 +
            Math.sin(
                progress *
                Math.PI *
                8
            ) *
            7;


        positions[i3 + 2] =
            Math.sin(angle) *
            radius;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xffe2a1,

            size:
                2.7,

            transparent:
                true,

            opacity:
                0.8,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const spiral =
        new THREE.Points(
            geometry,
            material
        );


    universe.add(
        spiral
    );


    return spiral;

}


const centralSpiral =
    createCentralSpiral();


/* =========================================================
   CORAÇÃO
========================================================= */

function createHeart() {

    const count = 9000;

    const scale = 12;

    const positions =
        new Float32Array(
            count * 3
        );


    const original =
        new Float32Array(
            count * 3
        );


    /*
       Construímos o contorno do
       coração uma vez, como um
       polígono, para testar quais
       pontos caem dentro dele.
    */

    const boundarySegments = 260;

    const boundary = [];


    for (
        let i = 0;
        i < boundarySegments;
        i++
    ) {

        const t =
            (
                i /
                boundarySegments
            ) *
            Math.PI *
            2;


        const point =
            heartPoint(t);


        boundary.push([

            point.x *
            scale,

            point.y *
            scale

        ]);

    }


    let minX = Infinity;

    let maxX = -Infinity;

    let minY = Infinity;

    let maxY = -Infinity;


    boundary.forEach(
        ([x, y]) => {

            if (x < minX) minX = x;

            if (x > maxX) maxX = x;

            if (y < minY) minY = y;

            if (y > maxY) maxY = y;

        }
    );


    function isInsideHeart(
        x,
        y
    ) {

        let inside = false;


        for (
            let i = 0, j = boundary.length - 1;
            i < boundary.length;
            j = i++
        ) {

            const xi = boundary[i][0];

            const yi = boundary[i][1];

            const xj = boundary[j][0];

            const yj = boundary[j][1];


            const intersect =

                (
                    (yi > y) !==
                    (yj > y)
                ) &&

                (
                    x <
                    (
                        (xj - xi) *
                        (y - yi) /
                        (yj - yi)
                    ) +
                    xi
                );


            if (intersect) {

                inside =
                    !inside;

            }

        }


        return inside;

    }


    const maxRadius =
        Math.max(
            maxX - minX,
            maxY - minY
        ) / 2;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const i3 =
            i * 3;


        /*
           Preenchimento uniforme:
           sorteamos pontos dentro
           da caixa e descartamos os
           que caem fora do coração.
        */

        let px = 0;

        let py = 0;


        for (
            let attempt = 0;
            attempt < 40;
            attempt++
        ) {

            px =
                random(
                    minX,
                    maxX
                );


            py =
                random(
                    minY,
                    maxY
                );


            if (
                isInsideHeart(
                    px,
                    py
                )
            ) {
                break;
            }

        }


        /*
           Mais volume perto do
           centro, achatando
           suavemente nas bordas.
        */

        const distanceFromCenter =
            Math.min(
                Math.sqrt(
                    px * px +
                    py * py
                ) /
                maxRadius,
                1
            );


        const pz =
            random(
                -55,
                55
            ) *
            (
                1 -
                distanceFromCenter * 0.5
            );


        positions[i3] =
            px;


        positions[i3 + 1] =
            py;


        positions[i3 + 2] =
            pz;


        original[i3] =
            px;


        original[i3 + 1] =
            py;


        original[i3 + 2] =
            pz;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    geometry.setAttribute(
        "original",
        new THREE.BufferAttribute(
            original,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            map:
                dotTexture,

            alphaTest:
                0.02,

            color:
                0xff6f9f,

            size:
                4.0,

            transparent:
                true,

            opacity:
                0.96,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false,

            sizeAttenuation:
                true

        });


    const heart =
        new THREE.Points(
            geometry,
            material
        );


    /*
       Posição parecida com
       o elemento central do GIF.
    */

    heart.position.set(
        0,
        190,
        -70
    );


    universe.add(
        heart
    );


    return heart;

}


const heart =
    createHeart();


/* =========================================================
   NÚCLEO BRILHANTE DO CORAÇÃO
========================================================= */

const heartCoreMaterial =
    new THREE.SpriteMaterial({

        map:
            glowTexture,

        color:
            0xff5f9d,

        transparent:
            true,

        opacity:
            0.9,

        blending:
            THREE.AdditiveBlending,

        depthWrite:
            false

    });


const heartCore =
    new THREE.Sprite(
        heartCoreMaterial
    );


heartCore.scale.set(
    170,
    170,
    1
);


heartCore.position.copy(
    heart.position
);


universe.add(
    heartCore
);


/* =========================================================
   CONTORNO DO CORAÇÃO
========================================================= */

function createHeartOutline() {

    const points = [];

    const segments = 900;


    for (
        let i = 0;
        i < segments;
        i++
    ) {

        const t =
            (
                i /
                segments
            ) *
            Math.PI *
            2;


        const point =
            heartPoint(t);


        points.push(

            new THREE.Vector3(

                point.x *
                12,

                point.y *
                12,

                70

            )

        );

    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({

            color:
                0xffb1cb,

            transparent:
                true,

            opacity:
                0.32,

            blending:
                THREE.AdditiveBlending

        });


    const line =
        new THREE.LineLoop(
            geometry,
            material
        );


    line.position.copy(
        heart.position
    );


    universe.add(
        line
    );


    return line;

}


const heartOutline =
    createHeartOutline();


/* =========================================================
   HALO DO CORAÇÃO
========================================================= */

function createHeartHalo() {

    const geometry =
        new THREE.SphereGeometry(
            155,
            32,
            32
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xff4f8d,

            transparent:
                true,

            opacity:
                0.045,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const halo =
        new THREE.Mesh(
            geometry,
            material
        );


    halo.position.copy(
        heart.position
    );


    universe.add(
        halo
    );


    return halo;

}


const heartHalo =
    createHeartHalo();


/* =========================================================
   CÓDIGOS DENTRO DO CORAÇÃO
========================================================= */

function createHeartCode() {

    const group =
        new THREE.Group();


    const characters =
        "01 ERROR 404 LOVE ♡ {} [] <> /";


    for (
        let i = 0;
        i < 430;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;


        const point =
            heartPoint(t);


        const fill =
            Math.sqrt(
                Math.random()
            );


        const x =
            point.x *
            fill *
            12;


        const y =
            point.y *
            fill *
            12;


        const z =
            random(
                -75,
                75
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width = 80;

        canvas.height = 40;


        const context =
            canvas.getContext(
                "2d"
            );


        context.clearRect(
            0,
            0,
            80,
            40
        );


        context.font =
            "bold 15px monospace";


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        context.fillStyle =
            "rgba(255,205,225,0.85)";


        const character =
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];


        context.fillText(
            character,
            40,
            20
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                opacity:
                    random(
                        0.3,
                        0.85
                    ),

                depthWrite:
                    false,

                blending:
                    THREE.AdditiveBlending

            });


        const sprite =
            new THREE.Sprite(
                material
            );


        sprite.position.set(
            x,
            y,
            z
        );


        sprite.scale.set(
            25,
            13,
            1
        );


        group.add(
            sprite
        );

    }


    group.position.copy(
        heart.position
    );


    universe.add(
        group
    );


    return group;

}


const heartCode =
    createHeartCode();


/* =========================================================
   FRASES
========================================================= */

const phrases = [

    "te amo",

    "meu amor",

    "minha vida",

    "meu universo",

    "para sempre",

    "você é meu lar",

    "meu lugar favorito",

    "eu escolheria você",

    "você e eu",

    "amor da minha vida",

    "minha pessoa",

    "♡",

    "fica comigo",

    "até o infinito",

    "você é tudo"

];


/* =========================================================
   TEXTO 3D
========================================================= */

function createTextSprite(
    text,
    size = 150
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 700;

    canvas.height = 180;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.font =
        "italic 42px Georgia";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillStyle =
        "rgba(255,143,181,0.95)";


    ctx.shadowColor =
        "rgba(255,90,150,0.65)";


    ctx.shadowBlur =
        15;


    ctx.fillText(
        text,
        350,
        90
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate =
        true;


    const material =
        new THREE.SpriteMaterial({

            map:
                texture,

            transparent:
                true,

            depthWrite:
                false

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.scale.set(
        size,
        size * 0.257,
        1
    );


    return sprite;

}


/* =========================================================
   GRUPO DE FRASES
========================================================= */

const textGroup =
    new THREE.Group();


const phrasePositions = [

    [-560, -120, 40],

    [-390, -95, 190],

    [-230, -110, 350],

    [0, -125, 470],

    [280, -105, 370],

    [460, -100, 210],

    [610, -125, 30],

    [-700, -150, -190],

    [-470, -145, -330],

    [-170, -150, -470],

    [180, -145, -450],

    [470, -135, -300],

    [700, -150, -150],

    [-40, -90, 650],

    [380, -120, 590]

];


phrasePositions.forEach(
    (position, index) => {

        const sprite =
            createTextSprite(
                phrases[
                    index %
                    phrases.length
                ],
                random(
                    125,
                    175
                )
            );


        sprite.position.set(
            position[0],
            position[1],
            position[2]
        );


        sprite.userData.originalScale =
            sprite.scale.x;


        textGroup.add(
            sprite
        );

    }
);


universe.add(
    textGroup
);


/* =========================================================
   MEMÓRIAS
========================================================= */

const memories = [

    {
        title:
            "Para Sempre",

        text:
            "Algumas coisas não precisam de explicação.\nElas simplesmente fazem sentido.",

        image:
            "assets/memory-1.jpg"
    },

    {
        title:
            "Meu Amor",

        text:
            "Entre todas as pessoas,\neu ainda escolheria você.",

        image:
            "assets/memory-2.jpg"
    },

    {
        title:
            "Meu Universo",

        text:
            "Se o universo fosse infinito,\neu ainda encontraria você.",

        image:
            "assets/memory-3.jpg"
    },

    {
        title:
            "Minha Pessoa",

        text:
            "No meio de bilhões de estrelas,\nfoi você que virou meu universo.",

        image:
            "assets/memory-4.jpg"
    },

    {
        title:
            "Nós Dois",

        text:
            "Eu não quero apenas momentos.\nQuero uma história inteira com você.",

        image:
            "assets/memory-5.jpg"
    }

];


const memoryObjects = [];


/* =========================================================
   TEXTURA DE PLANETA
========================================================= */

function createPlanetTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 256;

    canvas.height = 256;


    const ctx =
        canvas.getContext(
            "2d"
        );


    /*
       Gradiente base.
    */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            256
        );


    gradient.addColorStop(
        0,
        "#f8d9a3"
    );


    gradient.addColorStop(
        0.5,
        "#dd9a52"
    );


    gradient.addColorStop(
        1,
        "#8a4a24"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        256,
        256
    );


    /*
       Faixas horizontais.
    */

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const y =
            random(
                0,
                256
            );


        const height =
            random(
                3,
                12
            );


        const light =
            Math.random() >
            0.5;


        ctx.fillStyle =
            light
                ? `rgba(255,230,190,${random(0.06,0.16)})`
                : `rgba(90,45,20,${random(0.08,0.20)})`;


        ctx.fillRect(
            0,
            y,
            256,
            height
        );

    }


    /*
       Manchas/ruído da superfície.
    */

    for (
        let i = 0;
        i < 500;
        i++
    ) {

        const x =
            random(
                0,
                256
            );


        const y =
            random(
                0,
                256
            );


        const r =
            random(
                0.5,
                2.4
            );


        ctx.fillStyle =
            `rgba(255,240,210,${random(0.04,0.14)})`;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            r,
            0,
            Math.PI * 2
        );


        ctx.fill();

    }


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.wrapS =
        THREE.RepeatWrapping;


    texture.wrapT =
        THREE.RepeatWrapping;


    return texture;

}


/* =========================================================
   CRIAR MEMÓRIA VISUAL
========================================================= */

function createMemory(
    index,
    x,
    y,
    z,
    size
) {

    const group =
        new THREE.Group();


    /*
       Esfera central.
    */

    const sphereGeometry =
        new THREE.SphereGeometry(
            size,
            24,
            24
        );


    const planetTexture =
        createPlanetTexture();


    const sphereMaterial =
        new THREE.MeshStandardMaterial({

            map:
                planetTexture,

            emissive:
                0x3a1a10,

            emissiveIntensity:
                0.25,

            roughness:
                0.65,

            metalness:
                0.1,

            transparent:
                true,

            opacity:
                0.98

        });


    const sphere =
        new THREE.Mesh(
            sphereGeometry,
            sphereMaterial
        );


    group.add(
        sphere
    );


    /*
       Halo suave em volta do planeta,
       tipo brilho de estrela (sprite
       sempre de frente pra câmera).
    */

    const glowMaterial =
        new THREE.SpriteMaterial({

            map:
                glowTexture,

            color:
                0xffcf8a,

            transparent:
                true,

            opacity:
                0.75,

            blending:
                THREE.AdditiveBlending,

            depthWrite:
                false

        });


    const glow =
        new THREE.Sprite(
            glowMaterial
        );


    glow.scale.set(
        size * 4.6,
        size * 4.6,
        1
    );


    group.add(
        glow
    );


    /*
       Anel luminoso.
    */

    const ringGeometry =
        new THREE.TorusGeometry(
            size * 1.3,
            1.4,
            8,
            48
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0xffd58a,

            transparent:
                true,

            opacity:
                0.55,

            blending:
                THREE.AdditiveBlending

        });


    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    ring.rotation.x =
        Math.PI / 2;


    group.add(
        ring
    );


    /*
       Pequeno símbolo.
    */

    const symbol =
        createTextSprite(
            "♡",
            85
        );


    symbol.position.z =
        size * 1.5;


    group.add(
        symbol
    );


    group.position.set(
        x,
        y,
        z
    );


    group.userData.memory =
        index;


    group.userData.baseY =
        y;


    universe.add(
        group
    );


    memoryObjects.push(
        group
    );


    return group;

}


/* =========================================================
   POSIÇÕES DAS MEMÓRIAS
========================================================= */

createMemory(
    0,
    -520,
    10,
    40,
    30
);


createMemory(
    1,
    -310,
    65,
    230,
    25
);


createMemory(
    2,
    360,
    35,
    300,
    34
);


createMemory(
    3,
    570,
    -10,
    80,
    27
);


createMemory(
    4,
    -650,
    -40,
    -260,
    38
);


/* =========================================================
   RAYCASTER
========================================================= */

const raycaster =
    new THREE.Raycaster();


const pointer =
    new THREE.Vector2();


window.addEventListener(
    "click",
    (event) => {

        if (
            !galaxyStarted
        ) {
            return;
        }


        if (
            event.target.closest(
                "button"
            )
        ) {
            return;
        }


        pointer.x =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        pointer.y =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1;


        raycaster.setFromCamera(
            pointer,
            camera
        );


        const intersections =
            raycaster.intersectObjects(
                memoryObjects,
                true
            );


        if (
            intersections.length === 0
        ) {
            return;
        }


        let selected =
            intersections[0].object;


        while (
            selected.parent &&
            selected.userData.memory === undefined
        ) {

            selected =
                selected.parent;

        }


        if (
            selected.userData.memory === undefined
        ) {
            return;
        }


        const memory =
            memories[
                selected.userData.memory
            ];


        memoryTitle.textContent =
            memory.title;


        memoryText.textContent =
            memory.text;


        if (
            memory.image
        ) {

            memoryImage.src =
                memory.image;


            memoryImage.style.display =
                "block";

        } else {

            memoryImage.removeAttribute(
                "src"
            );


            memoryImage.style.display =
                "none";

        }


        memoryOverlay.classList.add(
            "show"
        );

    }
);


/* =========================================================
   FECHAR MEMÓRIA
========================================================= */

closeMemory.addEventListener(
    "click",
    () => {

        memoryOverlay.classList.remove(
            "show"
        );

    }
);


/* =========================================================
   INFO
========================================================= */

infoButton.addEventListener(
    "click",
    () => {

        memoryTitle.textContent =
            "Meu Universo";


        memoryText.textContent =
            "Cada estrela aqui representa\num pedacinho do que sinto por você.";


        memoryImage.removeAttribute(
            "src"
        );


        memoryImage.style.display =
            "none";


        memoryOverlay.classList.add(
            "show"
        );

    }
);


/* =========================================================
   MÚSICA
========================================================= */

musicButton.addEventListener(
    "click",
    () => {

        musicButton.textContent =
            musicButton.textContent ===
            "♫"
                ? "♪"
                : "♫";

    }
);


/* =========================================================
   ENTRAR NA GALÁXIA
========================================================= */

startButton.addEventListener(
    "click",
    () => {

        if (
            galaxyStarted
        ) {
            return;
        }


        galaxyStarted =
            true;


        galaxy.classList.add(
            "active"
        );


        /*
           Começamos mais longe.
        */

        camera.position.set(
            0,
            100,
            1250
        );


        /*
           A intro começa a desaparecer.
        */

        setTimeout(
            () => {

                intro.classList.add(
                    "hide"
                );

            },
            100
        );

    }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        composer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================================
   ANIMAÇÃO
========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    elapsed +=
        0.01;


    /* =====================================================
       MOUSE SUAVE
    ===================================================== */

    mouseX +=
        (
            targetMouseX -
            mouseX
        ) *
        0.025;


    mouseY +=
        (
            targetMouseY -
            mouseY
        ) *
        0.025;


    /* =====================================================
       UNIVERSO
    ===================================================== */

    universe.rotation.y +=
        0.00018;


    universe.rotation.x =
        Math.sin(
            elapsed * 0.05
        ) *
        0.015;


    /* =====================================================
       ESTRELAS
    ===================================================== */

    stars.rotation.y +=
        0.00022;


    tinyStars.rotation.y -=
        0.00012;


    /* =====================================================
       CHÃO
    ===================================================== */

    floor.rotation.y +=
        0.0003;


    /* =====================================================
       ÓRBITAS
    ===================================================== */

    orbit1.rotation.y +=
        0.0007;


    orbit2.rotation.y -=
        0.00045;


    orbit3.rotation.y +=
        0.00028;


    orbit4.rotation.y -=
        0.00018;


    centralSpiral.rotation.y +=
        0.0011;


    /* =====================================================
       CORAÇÃO — PULSO
    ===================================================== */

    const heartPulse =
        1 +
        Math.sin(
            elapsed * 1.5
        ) *
        0.045;


    heart.scale.set(
        heartPulse,
        heartPulse,
        heartPulse
    );


    heart.rotation.y =
        Math.sin(
            elapsed * 0.22
        ) *
        0.08;


    heart.rotation.z =
        Math.sin(
            elapsed * 0.17
        ) *
        0.018;


    /* =====================================================
       NÚCLEO
    ===================================================== */

    const coreScale =
        170 *
        (
            1 +
            Math.sin(
                elapsed * 1.5
            ) *
            0.12
        );


    heartCore.scale.set(
        coreScale,
        coreScale,
        1
    );


    heartCore.material.opacity =
        0.75 +
        Math.sin(
            elapsed * 1.5
        ) *
        0.15;


    /* =====================================================
       CONTORNO
    ===================================================== */

    heartOutline.scale.copy(
        heart.scale
    );


    heartOutline.rotation.copy(
        heart.rotation
    );


    /* =====================================================
       CÓDIGOS
    ===================================================== */

    heartCode.rotation.y =
        heart.rotation.y;


    heartCode.rotation.z =
        Math.sin(
            elapsed * 0.20
        ) *
        0.035;


    /* =====================================================
       HALO
    ===================================================== */

    const haloScale =
        1 +
        Math.sin(
            elapsed * 1.2
        ) *
        0.10;


    heartHalo.scale.set(
        haloScale,
        haloScale,
        haloScale
    );


    heartHalo.material.opacity =
        0.035 +
        (
            Math.sin(
                elapsed * 1.3
            ) *
            0.01
        );


    /* =====================================================
       FRASES
    ===================================================== */

    textGroup.rotation.y =
        Math.sin(
            elapsed * 0.08
        ) *
        0.10;


    textGroup.rotation.x =
        Math.sin(
            elapsed * 0.11
        ) *
        0.025;


    textGroup.children.forEach(
        (sprite, index) => {

            const breathe =
                1 +
                Math.sin(
                    elapsed * 0.7 +
                    index
                ) *
                0.025;


            sprite.scale.x =
                sprite.userData.originalScale *
                breathe;


            sprite.scale.y =
                (
                    sprite.userData.originalScale *
                    0.257
                ) *
                breathe;

        }
    );


    /* =====================================================
       MEMÓRIAS
    ===================================================== */

    memoryObjects.forEach(
        (object, index) => {

            object.position.y =
                object.userData.baseY +
                Math.sin(
                    elapsed * 0.8 +
                    index
                ) *
                15;


            object.rotation.y =
                elapsed *
                (
                    0.15 +
                    index * 0.02
                );


            const scale =
                1 +
                Math.sin(
                    elapsed * 1.8 +
                    index
                ) *
                0.10;


            object.scale.setScalar(
                scale
            );

        }
    );


    /* =====================================================
       CÂMERA
    ===================================================== */

    if (
        galaxyStarted
    ) {

        /*
           Entrada suave.
        */

        const desiredZ =
            720 +
            Math.sin(
                elapsed * 0.22
            ) *
            25;


        camera.position.z +=
            (
                desiredZ -
                camera.position.z
            ) *
            0.006;


        /*
           Movimento seguindo
           o mouse.
        */

        const desiredX =
            mouseX *
            100;


        const desiredY =
            110 -
            mouseY *
            55;


        camera.position.x +=
            (
                desiredX -
                camera.position.x
            ) *
            0.015;


        camera.position.y +=
            (
                desiredY -
                camera.position.y
            ) *
            0.015;


        camera.lookAt(
            0,
            120,
            0
        );

    }


    /* =====================================================
       RENDER
    ===================================================== */

    composer.render();

}


animate();

// app.ts

import * as PIXI from 'pixi.js';
import { FpsMeter } from './fps-meter';

interface EngineParams {
    containerId: string,
    canvasW: number,
    canvasH: number,
    fpsMax: number
}

class Engine {
    public container: HTMLElement;
    public loader: PIXI.Loader;
    public renderer: PIXI.Renderer;
    public stage: PIXI.Container;
    public graphics: PIXI.Graphics;
    public fpsMax: number;

    constructor(params: EngineParams) {
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({
            width: params.canvasW,
            height: params.canvasH,
            antialias: true
        });
        this.stage = new PIXI.Container();
        this.graphics = new PIXI.Graphics();
        this.fpsMax = params.fpsMax;

        this.container = params.containerId ? document.getElementById(params.containerId) || document.body : document.body;
        this.container.appendChild(this.renderer.view);
    } // constructor
} // Engine

const engine = new Engine({
    containerId: 'game',
    canvasW: 800,
    canvasH: 450,
    fpsMax: 60
});

let fpsMeter: FpsMeter;
const sprite = PIXI.Sprite.from('images/logo.png');
const btnPlay = PIXI.Sprite.from('images/btn.png');

function resizeCanvas(): void {
    const resize = () => {
        engine.renderer.resize(window.innerWidth, window.innerHeight);
        engine.stage.scale.x = window.innerWidth / engine.renderer.width;
        engine.stage.scale.y = window.innerHeight / engine.renderer.height;
    };

    resize();

    window.addEventListener("resize", resize);
}

// ==============
// === STATES ===
// ==============

window.onload = load;

function load() {
    resizeCanvas();
    create();
} // load

function create() {
    /* ***************************** */
    /* Create your Game Objects here */
    /* ***************************** */

    /* Sprite */
    sprite.anchor.set(0.5);
    sprite.x = engine.renderer.width / 2;
    sprite.y = engine.renderer.height / 2;
    // engine.stage.addChild(sprite);

    // Button play
    btnPlay.anchor.set(0.5);
    btnPlay.width = 200;
    btnPlay.height = 160;
    btnPlay.x = engine.renderer.width / 2;
    btnPlay.y = engine.renderer.height / 2;
    btnPlay.interactive = true;
    btnPlay.buttonMode = true;
    btnPlay.addListener('pointerdown', () => {
        console.log('aqui');
        engine.stage = sprite;
    });
    engine.stage.addChild(btnPlay);
    console.log(engine.stage);



    /* FPS */
    const fpsMeterItem = document.createElement('div');
    fpsMeterItem.classList.add('fps');
    engine.container.appendChild(fpsMeterItem);

    fpsMeter = new FpsMeter(() => {
        fpsMeterItem.innerHTML = 'FPS: ' + fpsMeter.getFrameRate().toFixed(2).toString();
    });

    setInterval(update, 1000.0 / engine.fpsMax);
    render();
} // create

function update() {
    fpsMeter.updateTime();

    /* ***************************** */
    /* Update your Game Objects here */
    /* ***************************** */

} // update

function render() {
    requestAnimationFrame(render);

    /* ***************************** */
    /* Render your Game Objects here */
    /* ***************************** */

    /* Sprite */
    sprite.rotation += 0.01;

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render

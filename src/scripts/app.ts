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
// const btnPlay = PIXI.Sprite.from('images/btn.png');
const game = new PIXI.Container();
const container = new PIXI.Container();
// let background;
let peca : PIXI.Sprite;
let jogando : boolean = false;
let pecaNum :int = 0;
let click1 :PIXI.Sprite;
let click2 :PIXI.Sprite;
let trocando : boolean = false;

function troca(obj:PIXI.Sprite):void{
    if( !trocando){
        click1 = obj;
        click1.alpha = 0.5;
        trocando = true;
        console.log(click2);
        
    }else if(trocando){
        trocando = false;
        click2 = obj;

        var index1x = click1.x;
	    var index2x = click2.x;
        
        var index1y = click1.y;
	    var index2y = click2.y;

        console.log(index1x, index2x);
        
        click1.x = index2x;
        click2.x = index1x;

        click1.y = index2y;
        click2.y = index1y;

        click1.alpha = 1;


        // container.swapChildren(click1, click2);

        // var index1 = container.children.indexOf(click1);
	    // var index2 = container.children.indexOf(click2);
        // console.log(index1, index2);
        // container.removeChild(click1);
        // container.removeChild(click2);
        // // return;
        // if(index1 < index2)
        // {
        //     console.log('aqui');
            
        //     container.addChildAt(click2, index1);
        //     container.addChildAt(click1, index2);
        // }
        // else
        // {
        //     console.log('aqui 2');

        //     container.addChildAt(click1, index2);
        //     container.addChildAt(click2, index1);
        // }
        // container.updateTransform();
        //limpar variaveis
    }
}

function resizeCanvas(): void {
    const resize = () => {
        engine.renderer.resize(window.innerWidth, window.innerHeight);
        engine.stage.scale.x = window.innerWidth / engine.renderer.width;
        engine.stage.scale.y = window.innerHeight / engine.renderer.height;
    };

    resize();

    window.addEventListener("resize", resize);
}

function randomInt(min : int, max:int) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==============
// === STATES ===
// ==============

window.onload = load;

function load() {
    resizeCanvas();
    engine.loader.add('matchup', 'images/matchup.json');
    engine.loader.add('sparkles', 'images/sparkles.json');
    engine.loader.load(create);
    // create();
} // load

function create() {
    /* ***************************** */
    /* Create your Game Objects here */
    /* ***************************** */

    // background
    let background = new PIXI.Sprite( PIXI.Texture.from(`asset_bg.png`) );
    background.anchor.set(0.5);
    background.x = engine.renderer.width / 2;
    background.y = engine.renderer.height / 2;
    // container.width = engine.renderer.width;
    // container.height = engine.renderer.height;
    game.addChild(background);

    // pecas
    const pecas = [];
    for (let i = 1; i <=6; i++) {
        const texture = PIXI.Texture.from(`asset_gem${i}.png`);
        pecas.push(texture);
    }

    for (let i = 0; i < 8; i++) {//cria pecas
        for (let j = 0; j < 8; j++) {
            pecaNum++;
            let numFrame = randomInt(1,5);
            // console.log(numFrame);
            peca = new PIXI.Sprite(pecas[numFrame]);
            peca.name = 'peca'+pecaNum;
            peca.anchor.set(0.5);
            peca.x = i*50;
            peca.y = j*50;
            peca.width = 50;
            peca.height = 50;
            peca.interactive = true;
            peca.buttonMode = true;
            peca.on('pointerdown', (event:any) => {
                console.log(event.target.name);
                troca(event.target)
                // container.updateTransform();
                // even.
            });
            // peca.swapChildren
            // peca.vx = 0;
            container.addChild(peca);
            
        }
    }
    // container.swapChildren()
    container.width = 410;
    container.height = 410;
    container.x = (engine.renderer.width / 2) - ( (container.width/2) - 25);
    container.y = (engine.renderer.height / 2) - ( (container.height/2) - 50);
    console.log(container.y+410);
    game.addChild(container);
    

    /* Sprite */
    sprite.anchor.set(0.5);
    sprite.x = engine.renderer.width / 2;
    sprite.y = 100;
    game.addChild(sprite);

    // Button play
    
    let btnPlay = new PIXI.Sprite( PIXI.Texture.from(`asset_button_up.png`) );
    btnPlay.anchor.set(0.5);
    btnPlay.width = 200;
    btnPlay.height = 160;
    btnPlay.x = engine.renderer.width / 2;
    btnPlay.y = engine.renderer.height / 2;
    btnPlay.interactive = true;
    btnPlay.buttonMode = true;
    btnPlay.addListener('pointerdown', () => {
        console.log('aqui');
        engine.stage = game;
        jogando = true;
    });
    engine.stage.addChild(btnPlay);
    // console.log(engine.stage);



    /* FPS */
    const fpsMeterItem = document.createElement('div');
    fpsMeterItem.classList.add('fps');
    engine.container.appendChild(fpsMeterItem);

    fpsMeter = new FpsMeter(() => {
        fpsMeterItem.innerHTML = 'FPS: ' + fpsMeter.getFrameRate().toFixed(2).toString();
    });

    setInterval(update, 1000.0 / engine.fpsMax);
    render();

    console.log(engine.stage);
    
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

    if(jogando && false){

        container.children.forEach(element => {
            // console.log(container.y+container.height);
            
            if(element.y < (container.y+container.height) ){
                element.y +=1;
            }
        });
    }
    

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render

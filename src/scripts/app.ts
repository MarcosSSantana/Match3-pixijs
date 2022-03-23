// app.ts

import * as PIXI from 'pixi.js';
import { FpsMeter } from './fps-meter';
import { gsap } from "gsap";

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
    canvasW: 768,
    canvasH: 1024,
    fpsMax: 60
});

let fpsMeter: FpsMeter;
// const sprite = PIXI.Sprite.from('images/logo.png');

const game = new PIXI.Container();
const container = new PIXI.Container();
let peca : PIXI.Sprite;
let pecaNum :int = 0;
let pecaH : int = 50;
let pecaW : int = 50;

let jogando : boolean = false;
let fisica : boolean = false;
let click1 :PIXI.Sprite;
let click2 :PIXI.Sprite;
let trocando : boolean = false;

function adjacente(difX:Number, difY:Number):boolean{
    if( ( difX == pecaW || difX == -pecaW ) && difY == 0 ){//horizontal
        console.log('horizontal');
        return true;
    }else if( ( difY == pecaH || difY == -pecaH )  && difX == 0 ){//vertical
        console.log('vertical');
        return true;
    }else{
        return false;
    }
}

function checkWin(container:PIXI.Container):boolean{
    let obj = container.children;
    console.log(obj);

    // obj[0].destroy();
    // obj[6].destroy();
    // return;
    let arrayWin = [];
    //CHECA COLUNA
    for (let j = 0; j < 8; j++) {
        let ini = j*8;
        let max = ini+7;
        // console.log(ini, max);
        
        for (let i = ini; i <= max; i++) {
            if(container.children[i] != undefined){
                // console.log(i);
                
                arrayWin.push(container.children[i]);
                
                if(arrayWin.length >3){
                    arrayWin.shift();
                }
                // console.log(arrayWin);
                if( arrayWin.length == 3 ){
                    if( (arrayWin[0].name == arrayWin[1].name) && (arrayWin[0].name == arrayWin[2].name) ){
                        arrayWin.forEach(element => {
                            element.destroy();
                            // element.alpha = 0.5;
                        });
                        arrayWin = [];
                        return true;
                    }
                }
            }
        }
    }
    
    //CHECA LINHA
    for (let j = 0; j < 8; j++) {
        let num = j;
        for (let i = 0; i < 8; i++) {
            // console.log(num);
            
            if(container.children[num] != undefined){
                // console.log(num);
                
                arrayWin.push(container.children[num]);
                
                if(arrayWin.length >3){
                    arrayWin.shift();
                }
                // console.log(arrayWin);
                if( arrayWin.length == 3 ){
                    if( (arrayWin[0].name == arrayWin[1].name) && (arrayWin[0].name == arrayWin[2].name) ){
                        arrayWin.forEach(element => {
                            element.destroy();
                            // element.alpha = 0.5;
                        });
                        arrayWin = [];
                        return true;
                    }
                }
            }
            num +=8;
        }
    }

    return false;
    // console.log(container.children[0].texture.textureCacheIds[0]);
    
}

function troca(obj:PIXI.Sprite):void{
    
    if( !trocando){
        click1 = obj;
        click1.alpha = 0.5;
        trocando = true;
        // console.log(click2);
        
    }else if(trocando){
        trocando = false;
        click2 = obj;
        // console.log(container.children.indexOf(click1), container.children.indexOf(click2));
        // console.log(click1.x, click2.x);
        // console.log(click1.y, click2.y);
        
        // pega a diferença
        let difX = click1.x-click2.x;
        let difY = click1.y-click2.y;
        // console.log(difX, difY);

        if ( !adjacente(difX, difY) ){//compara se é a posição do lado
            console.log('adjacente');
            
            gsap.to(click1, 1, {
                alpha: 1,
            });
            return;
        }

        // if( ( difX == 50 || difX == -50 ) && difY == 0 ){//horizontal
        //     console.log('horizontal');
        // }else if( ( difY == 50 || difY == -50 )  && difX == 0 ){//vertical
        //     console.log('vertical');
        // }else{
        //     gsap.to(click1, 1, {
        //         alpha: 1,
        //     });
        //     return;
        // }
        // if(click1.x)
        container.swapChildren(click1, click2);// troca as posições
        var index1x = click1.x;
        var index1y = click1.y;
        
	    var index2x = click2.x;
	    var index2y = click2.y;
        
        //anima a troca
        gsap.to(click1, 1, {
            alpha: 1,
            x: index2x,
            y: index2y
        });

        gsap.to(click2, 1, {
            alpha: 1,
            x: index1x,
            y: index1y
        })

        setTimeout(() => {
            if( checkWin(container) ){
                console.log('teve win');
                
                setTimeout(() => {
                    fisica = true;
                    setTimeout(() => {
                        fisica = false;
                        
                    }, 1000);
                }, 500);
        
                // container.children.forEach((element, key) => {
                //     // console.log(container.y+container.height);
                    
                //     if(element.y < (350) ){
                    
                //         if( !(colisao(element, container.children[key+1])) ){
                        
                //             // element.y +=5;
                //             gsap.to(element, 1, {
                //                 y: element.y+pecaH
                //             })
                //         }
                //     }
        
                // });
            }
        }, 1200);
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
    const background = new PIXI.Sprite( PIXI.Texture.from(`asset_bg.png`) );
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
    // console.log(pecas[0].textureCacheIds[0]);
    
    for (let i = 0; i < 8; i++) {//cria pecas
        for (let j = 0; j < 8; j++) {
            pecaNum++;
            let numFrame = randomInt(0,4);
            if(pecaNum>4){
                pecaNum = 0;
            }
            numFrame = pecaNum;
            // console.log(numFrame);
            peca = new PIXI.Sprite(pecas[numFrame]);
            // peca.name = 'peca'+pecaNum;
            peca.name = pecas[numFrame].textureCacheIds[0];
            peca.anchor.set(0.5);
            peca.x = i*pecaW;
            peca.y = j*pecaH;
            peca.width = pecaW;
            peca.height = pecaH;
            peca.interactive = true;
            peca.buttonMode = true;
            peca.on('pointerdown', (event:any) => {
                // console.log(event.target.texture.textureCacheIds[0]);
                troca(event.target)
            });
            peca.on('pointermove', onDragMove);
           
            container.addChild(peca);
            
        }
    }
    console.log(pecaNum);
    
    // container.swapChildren()
    container.width = 410;
    container.height = 410;
    container.x = (engine.renderer.width / 2) - ( (container.width/2) - 25);
    container.y = (engine.renderer.height / 2) - ( (container.height/2) - 50);
    console.log(container.y+410);
    game.addChild(container);
    

    // /* Sprite */
    // sprite.anchor.set(0.5);
    // sprite.x = engine.renderer.width / 2;
    // sprite.y = 100;
    // game.addChild(sprite);

    // Button play
    const btnPlay = new PIXI.Sprite( PIXI.Texture.from(`asset_large_btn_down.png`) );
    btnPlay.anchor.set(0.5);
    btnPlay.x = engine.renderer.width / 2;
    btnPlay.y = engine.renderer.height / 2;
    btnPlay.interactive = true;
    btnPlay.buttonMode = true;
    btnPlay.on('pointerdown', (event:any) => {
        event.target.alpha = 0.4;
        event.target.scale.set(0.9);
        // this.texture = test;
    });
    btnPlay.on('pointerup', (event:any) => {
        event.target.alpha = 1;
        engine.stage = game;
        jogando = true;
    });

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 46,
        fontWeight: 'bold',
        fill: ['#ffffff', '#a1a1a1'], // gradient
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });
    const btnText = new PIXI.Text('PLAY', style);
    btnText.anchor.set(0.5);
    btnPlay.addChild(btnText);

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

function onDragMove() {
    // console.log(event);
    
    // // if (this.dragging) {
    //     const newPosition = this.data.getLocalPosition(this.parent);
    //     this.x = newPosition.x;
    //     this.y = newPosition.y;
    // }
}

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
    // sprite.rotation += 0.01;

    // if(jogando && false){

    if(jogando && fisica){

        // container.children.forEach((element, key) => {
        container.children.forEach((element, key) => {
            // console.log(container.y+container.height);
            if((element.y) < (350) ){
               
                if( !(colisao(element, container.children[key+1])) ){
                  
                    element.y +=5;
                    // gsap.to(element, 1, {
                    //     y: element.y+pecaH
                    // })
                }
            }

        });
    }
    

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render

function colisao(obja:PIXI.DisplayObject, objb:PIXI.DisplayObject):boolean{
    let boxA = obja.getBounds();
    let boxB = objb.getBounds();

    return  boxA.x + boxA.width > boxB.x &&
            boxA.x < boxB.x + boxB.width &&
            boxA.y + boxA.height+5 > boxB.y &&
            boxA.y < boxB.y + boxB.height+5;
}

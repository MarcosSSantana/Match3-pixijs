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
const lobby = new PIXI.Container();
const container = new PIXI.Container();
const pecas : Array<PIXI.Texture> = [];
// let peca : PIXI.Sprite;
let pecaNum :int = 0;
const pecaH : int = 50;
const pecaW : int = 50;

let time : int = 60;
let txtTime : PIXI.Text;

let points : int = 0;
let txtPoints : PIXI.Text;

let jogando : boolean = false;
let fisica : boolean = false;
let click1 :PIXI.Sprite;
let click2 :PIXI.Sprite;
let trocando : boolean = false;
let modal : PIXI.Sprite;

const style : PIXI.TextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 40,
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

function adjacente(difX:Number, difY:Number):boolean{
    if( ( difX == pecaW || difX == -pecaW ) && difY == 0 ){//horizontal
        // console.log('horizontal');
        return true;
    }else if( ( difY == pecaH || difY == -pecaH )  && difX == 0 ){//vertical
        // console.log('vertical');
        return true;
    }else{
        return false;
    }
}

function objPeca(x:int, y:int, numFrame:int):PIXI.Sprite{
    // console.log(x*pecaW, y*pecaH, numFrame, pecaW, pecaH);
    
    let peca = new PIXI.Sprite(pecas[numFrame]);
    peca.name = pecas[numFrame].textureCacheIds[0];
    peca.anchor.set(0.5);
    peca.x = x*pecaW;
    peca.y = y*pecaH;
    peca.width = pecaW;
    peca.height = pecaH;
    peca.interactive = true;
    peca.buttonMode = true;
    // peca.scale.set(60);
    peca.on('pointerdown', (event:any) => {
        // console.log(event.target.texture.textureCacheIds[0]);
        troca(event.target)
    });
    peca.on('pointermove', onDragMove);

    // container.addChild( peca );

    return peca;
}

function checkWin():boolean{
    // let obj = container.children;
    // console.log(obj);

    // return;
    let arrayWin = [];
    let arrayDeb = [];
    //CHECA COLUNA
    for (let j = 0; j < 8; j++) {
        let ini = j*8;
        let max = ini+7;
        // console.log(ini, max);
        
        for (let i = ini; i <= max; i++) {
            if(container.children[i] != undefined){
                // console.log(i);
                
                arrayWin.push(container.children[i]);
                arrayDeb.push(container.children[i].name);

                if(arrayWin.length >3){
                    arrayWin.shift();
                    arrayDeb.shift();
                }
                if( arrayWin.length == 3 ){
                    if( (arrayWin[0].name == arrayWin[1].name) && (arrayWin[0].name == arrayWin[2].name) ){
                        // console.log(arrayDeb);
                        // console.log(i);

                        arrayWin.forEach(element => {
                            // let p = criaPeca(element.x, 0, 1);
                            // container.addChild( p );
                            // element.y = -50;
                            // element.
                            // element.texture = pecas[numFrame];
                            element.destroy();
                            // element.alpha = 0.5;
                            
                            // container.addChild( p );
                            container.updateTransform();
                        });
                        arrayDeb = [];
                        arrayWin = [];
                        return true;
                    }
                }
            }
        }
    }
    
    //CHECA LINHA
    // console.log('checa linha');
    
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
    if(jogando){
        if( !trocando){
            click1 = obj;
            click1.alpha = 0.5;
            trocando = true;
            // console.log(click2);
            
        }else if(trocando){
            trocando = false;
            click2 = obj;
            
            // pega a diferen??a
            let difX = click1.x-click2.x;
            let difY = click1.y-click2.y;
            // console.log(difX, difY);
    
            if ( !adjacente(difX, difY) ){//compara se ?? a posi????o do lado
                // console.log('adjacente');
                
                gsap.to(click1, 1, {
                    alpha: 1,
                });
                return;
            }
    
          
            container.swapChildren(click1, click2);// troca as posi????es
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
            /*
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
            */
        }
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

function criaPecas(){
    container.removeChildren();
    for (let i = 0; i < 8; i++) {//cria pecas
        for (let j = 0; j < 8; j++) {
            pecaNum++;
            let numFrame = randomInt(0,4);
            if(pecaNum>4){
                pecaNum = 0;
            }
            numFrame = pecaNum;
            
            container.addChild( objPeca(i, j, numFrame) );
        }
    }
    // console.log(pecaNum);
}

function animaModal():void{
    
    gsap.to(modal, 1, {
        visible: true,
        y: engine.renderer.height/2,
    });
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
} // load

function create() {
    /* ***************************** */
    /* Create your Game Objects here */
    /* ***************************** */

    // background
    const background = new PIXI.Sprite( PIXI.Texture.from(`asset_title_bg.png`) );
    background.anchor.set(0.5);
    background.x = engine.renderer.width / 2;
    background.y = engine.renderer.height / 2;
    lobby.addChild(background);

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
        points = 0;
        time = 60;
        criaPecas();
    });

    const btnText = new PIXI.Text('PLAY', style);
    btnText.anchor.set(0.5);
    btnPlay.addChild(btnText);
    lobby.addChild(btnPlay);
    engine.stage.addChild(lobby);

    /* ***************************** */
    /*         GAME                  */
    /* ***************************** */

    // container
    container.x = (engine.renderer.width / 2) -  (410/2)+30;
    container.y = (engine.renderer.height / 2) - ( (410/2) - 55);
    game.addChild(container);

    // frames pecas 
    for (let i = 1; i <=6; i++) {
        pecas.push( PIXI.Texture.from(`asset_gem${i}.png`));
    }
    
    // gameTable
    const gameTable = new PIXI.Sprite( PIXI.Texture.from(`asset_bg.png`) );
    gameTable.anchor.set(0.5);
    gameTable.x = engine.renderer.width / 2;
    gameTable.y = engine.renderer.height / 2;
    game.addChild(gameTable);

    //btn check win test function
    const btnWin = new PIXI.Sprite( PIXI.Texture.from(`asset_large_btn_down.png`) );
    btnWin.anchor.set(0.5);
    btnWin.x = engine.renderer.width / 2;
    btnWin.y = container.y+470;
    btnWin.interactive = true;
    btnWin.buttonMode = true;
    btnWin.on('pointerdown', (event:any) => {
        event.target.alpha = 0.4;
        event.target.scale.set(0.9);
        // this.texture = test;
    });
    btnWin.on('pointerup', (event:any) => {
        event.target.alpha = 1;

        if( checkWin() ){
            points++;
            // console.log('teve win');
            setTimeout(() => {
                fisica = true;
                setTimeout(() => {
                    fisica = false;
                }, 1000);
            }, 500);
        }
    });

    const txtTextWin = new PIXI.Text('check_Win');
    txtTextWin.anchor.set(0.5);
    btnWin.addChild(txtTextWin);
    game.addChild(btnWin);

    //time
    txtTime = new PIXI.Text("Time : "+time.toString(), style);
    txtTime.anchor.set(0.5);
    txtTime.x = engine.renderer.width / 2 + 200;
    txtTime.y = container.y-80;
    game.addChild(txtTime);

    //points
    txtPoints = new PIXI.Text("P : "+points.toString(), style);
    txtPoints.anchor.set(0.5);
    txtPoints.x = engine.renderer.width / 2 - 225;
    txtPoints.y = container.y-80;
    game.addChild(txtPoints);

    // modal
    modal = new PIXI.Sprite( PIXI.Texture.from(`asset_pause_menu.png`) );
    modal.anchor.set(0.5);
    modal.x = engine.renderer.width / 2;
    modal.y = engine.renderer.height / 2 + 400;
    modal.visible = false;
    game.addChild(modal);

    // btnMenu
    let btnMenu = new PIXI.Sprite( PIXI.Texture.from(`asset_button_down.png`) );
    btnMenu.anchor.set(0.5);
    btnMenu.interactive = true;
    btnMenu.buttonMode = true;
    btnMenu.on('pointerup', () => {
        engine.stage = lobby;
    });
    modal.addChild(btnMenu);

    //txtMenu
    let txtMenu = new PIXI.Text("menu",new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 25,
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
    }) );
    txtMenu.anchor.set(0.5);
    btnMenu.addChild(txtMenu);

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
    if(jogando){
        if(time > 0){
            time -= 0.01;
            txtTime.text = "Time : "+time.toFixed(0).toString();
            txtPoints.text = "P : "+points.toString();
            container.alpha = 1;

            modal.y = engine.renderer.height / 2 + 400;
            modal.visible = false;
        }else{
            // console.log('fim de jogo');
            jogando = false;
            container.alpha = 0.5;
            animaModal();
        }
       
    }
    

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

} // update

function render() {
    requestAnimationFrame(render);

    /* ***************************** */
    /* Render your Game Objects here */
    /* ***************************** */

    engine.renderer.render(engine.stage);
    fpsMeter.tick();
} // render

function colisao(obja:PIXI.DisplayObject, objb:PIXI.DisplayObject):boolean{

    try {
        let boxA = obja.getBounds();
        let boxB = objb.getBounds();

        return  boxA.x + boxA.width > boxB.x &&
            boxA.x < boxB.x + boxB.width &&
            boxA.y + boxA.height+5 > boxB.y &&
            boxA.y < boxB.y + boxB.height+5;
    } catch (error) {
        // console.log(error);
        
        return false;
    }

    
}

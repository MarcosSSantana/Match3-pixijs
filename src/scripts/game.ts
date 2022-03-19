import * as PIXI from 'pixi.js';

export function game(){
    const obj = PIXI.Sprite.from('images/logo.png');
    obj.anchor.set(0.5);
    obj.x = 50;
    obj.y = 50;
    return obj;
}
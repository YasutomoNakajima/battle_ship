import {PrototypeComponent} from "./PrototypeComponent.js";

export class BackGround extends PrototypeComponent{
    _create(){
        var style = new PIXI.TextStyle({
            fontSize: 80,
            fontWeight: "bold",
            fill: 0x6a5acd,
            fontFamily: "hm_tb"
        })
        var sprite = new PIXI.Text("Battle Ship", style)
        sprite.anchor.set(0.5)     // 基準点をスプライトの中心にセットする
        sprite.x = BackGround.WIDTH / 2       // スプライトの座標をステージの中心にする
        sprite.y = BackGround.HEIGHT / 2
        sprite.alpha = 0.2
        return sprite
    }
}
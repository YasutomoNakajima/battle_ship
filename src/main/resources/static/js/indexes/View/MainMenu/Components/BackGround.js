import {PrototypeComponent} from "../../PrototypeComponent.js";

export class BackGround extends PrototypeComponent {
    constructor(texture){
        super()
        this.texture = texture
        this._component = this.setup()
    }
    load(){
        var loader = PIXI.loader;
        loader
            .add("/images/mainmenu.png")
            .load(this._component = this.setup)
    }

    setup() {
        var sprite = new PIXI.Sprite(this.texture)
        sprite.anchor.set(0.5)
        sprite.position.x = BackGround.WIDTH / 2
        sprite.position.y = BackGround.HEIGHT / 2
        sprite.alpha = 0.7
        return sprite
    }
}
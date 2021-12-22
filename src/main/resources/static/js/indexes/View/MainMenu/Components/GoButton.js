import {PrototypeComponent} from "../../PrototypeComponent.js";

export class GoButton extends PrototypeComponent {
    constructor(texture, cL, mOverL, mOutL){
        super()
        this.texture = texture
        this.clickListner = cL
        this.mouseOverListner = mOverL
        this.mouseOutListner = mOutL
        this._component = this.setup()
    }
    load(){
        var loader = PIXI.loader;
        loader
            .add("/images/button.png")
            .load(this._component = this.setup)
    }

    setup() {
        var sprite = new PIXI.Sprite(this.texture)
        sprite.anchor.set(0.5)
        sprite.position.x = GoButton.WIDTH / 4
        sprite.position.y = GoButton.HEIGHT * 3 / 4
        sprite.interactive = true
        sprite.buttonMode = true
        sprite.on('pointerdown', this.clickListner)
        sprite.on('pointerover', this.mouseOverListner)
        sprite.on('pointerout', this.mouseOutListner)
        return sprite
    }
}
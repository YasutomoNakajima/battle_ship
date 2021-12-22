import {PrototypeComponent} from "../../PrototypeComponent.js";

export class TitleImage extends PrototypeComponent {
    constructor(al) {
        super()
        this.actionListner = al
        this.load()
    }

    load() {
        var loader = PIXI.loader;
        loader
            .add("/images/titleImage1.jpg")
            .load(this._component = this.setup())
    }

    setup() {
        var texture = PIXI.Texture.fromImage('/images/titleImage1.jpg')
        var sprite = new PIXI.Sprite(texture)
        sprite.anchor.set(0.5)
        sprite.position.x = TitleImage.WIDTH / 2
        sprite.position.y = TitleImage.HEIGHT / 2
        sprite.interactive = true
        sprite.buttonMode = true
        sprite.on('pointerdown', this.actionListner)
        return sprite
    }
}

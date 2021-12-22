import {PrototypeComponent} from "./PrototypeComponent.js";

export class Stage extends PrototypeComponent {

    constructor() {
        super()
        this.params = {
            backgroundColor: 0xe0ffff
        }
        this._renderer = PIXI.autoDetectRenderer(Stage.WIDTH, Stage.HEIGHT, this.params)
        this.__create()
    }

    __create() {
        $("main").append(this._renderer.view)    // DOMにレンダラーのビューを追加
        this._component = new PIXI.Container()   // ステージを生成
        this.redraw()
    }

    redraw() {
        this._renderer.render(this._component)     // レンダラーにステージを描画
    }
}


import {PrototypeComponent} from "./PrototypeComponent.js";

const StartImage = class extends PrototypeComponent{
    constructor(){
        super()
        this.flag = false
    }
    _create() {
        var start_screen = new PIXI.Graphics()
        start_screen.x = 0
        start_screen.y = 0
        start_screen.beginFill(0x87cefa)
        start_screen.drawRect(0,0,StartImage.WIDTH,StartImage.HEIGHT)
        start_screen.endFill()
        start_screen.interactive = true
        start_screen.buttonMode = true
        start_screen.on('click', this.click_action())
        start_screen.alpha = 1
        return start_screen
    }

    click_action(){
        //post("GameStart", "true")
        //stage.removeChild(start_screen)
        //print_text(4)
        //renderer.render(stage)
        this.flag = true
    }

    clicked_q() {
        if (this.flag) return true
        return false
    }
}
export {StartImage}
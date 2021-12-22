export class AppState{
    static WIDTH = 1440
    static HEIGHT = 810
    constructor(){
        this.nowScense = new Object
        this.app = new PIXI.Application(AppState.WIDTH, AppState.HEIGHT, {backgroundColor: 0xdcdcdc})
        $("main").append(this.app.view)
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    }
    setView(view){
        this.nowScense = view
        this.app.stage.addChild(view)
    }
    removeView(){
        this.app.stage.removeChild(this.nowScense)
    }
    testCall(){
        console.log("AppState test call")
        //this.app.stage.addChild(this.nowScense)
    }
}
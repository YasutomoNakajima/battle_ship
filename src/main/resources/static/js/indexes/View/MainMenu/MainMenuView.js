import {BackGround} from "./Components/BackGround.js";
import {GoButton} from "./Components/GoButton.js";

export class MainMenuView {
    constructor(appState, cL, mOverL, mOutL){
        this.appState = appState
        this.cL = cL
        this.mOverL = mOverL
        this.mOutL = mOutL

        this.backGround
        this.goButton
        this.main
    }

    imageLoad(){
        console.log("1")
        var loader = PIXI.loader
        //
        var puts = () =>{
            return new Promise(resolve => {
                loader
                    .add("/images/mainmenu.jpg")
                    .add("/images/button.png")
                    .load(()=>{
                        var texture = PIXI.Texture.fromImage('/images/mainmenu.jpg')
                        var texture2 = PIXI.Texture.fromImage('/images/mainmenu.jpg')
                        this.backGround = new BackGround(texture)
                        this.goButton = new GoButton(texture2, this.cL, this.mOverL, this.mOutL)
                        this.main = this.backGround.get_component()
                        console.log("2")
                        console.log("ロード完了！")
                        console.log(this.main)
                        //this.backGround.add(this.goButton)
                    })
            })
        }
        //

        return puts

    }

    getMain(){
        return this.main
    }

    setup(){
        var texture = PIXI.Texture.fromImage('/images/mainmenu.jpg')
        var texture2 = PIXI.Texture.fromImage('/images/mainmenu.jpg')
        this.backGround = new BackGround(texture)
        this.goButton = new GoButton(texture2, this.cL, this.mOverL, this.mOutL)
        this.main = this.backGround.get_component()
        this.backGround.add(this.goButton)
    }
}
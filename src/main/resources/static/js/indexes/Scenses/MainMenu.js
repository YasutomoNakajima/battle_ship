import {Scense} from "./Scense.js";
import {MainMenuView} from "../View/MainMenu/MainMenuView.js";

export class MainMenu extends Scense{
    constructor(appState){
        super(appState)
        this.mainMenuView// = new MainMenuView(this.clickLister_go, this.mouseOverListner_go, this.mouseOutLsitner_go)
    }
    scenseSwitch() {
        MainMenu.APP_STATE.removeView()
        console.log("switch main menu")
        this.mainMenuView = new MainMenuView(MainMenu.APP_STATE, this.clickLister_go, this.mouseOverListner_go, this.mouseOutLsitner_go)
        //
        var load = () =>{
            return new Promise(resolve => {
                this.mainMenuView.imageLoad()
            })
        }
        var load2 = this.mainMenuView.imageLoad()
        var draw = () =>{
            return new Promise(resolve => {
                this.drawScense()
            })
        }
        var puts = () =>{
            return new Promise(resolve => {
                console.log("4")
            })
        }
        var do_1 = async () => {
            const hoge = await load2()
            //const fuga = await draw()
            //const hebo = await puts()
        }
        var do_2 = async () => {
            const fuga = await draw()
        }
        var do_3 = async () => {
            const hebo = await puts()
        }
        do_1()
        do_2()
        do_3()
        //this.mainMenuView.imageLoad()
        //this.drawScense()
    }


    drawScense(){
        console.log("3")
        try{
            console.log(this.mainMenuView)
            //MainMenu.APP_STATE.setView(this.mainMenuView.main)
            return
        }catch (e) {
            console.log(e)
            //this.drawScense()
        }
    }
    clickLister_go(){
        console.log("go clicked")
        //MainMenu.NEXT_SCENSE.scenseSwitch()
    }
    mouseOverListner_go(){
        console.log("mouse over")
    }
    mouseOutLsitner_go(){
        console,log("mouse out")
    }
}
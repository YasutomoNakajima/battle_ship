import {Scense} from "./Scense.js";
import {TitleView} from "../View/Title/TitleView.js";

export class Title extends Scense{
    constructor(appState){
        super(appState)
        this.titleView = new TitleView(this.actionListner_titleImage)
    }

    drawScense(){
        try{
            Title.APP_STATE.setView(this.titleView.main)
            return
        }catch (e) {
            this.drawScense()
        }
    }

    actionListner_titleImage(){
        console.log("colled title image action listner")
        Title.NEXT_SCENSE.scenseSwitch()
    }
}
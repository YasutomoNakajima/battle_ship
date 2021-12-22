import {Scense} from "./Scense.js";

export class Result extends Scense{
    scenseSwitch(){
        //
    }
    actionListner_okButton(){
        this.nextScense.scenseSwitch()
    }
}
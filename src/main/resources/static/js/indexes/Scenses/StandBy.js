import {Scense} from "./Scense.js";

export class StandBy extends Scense{
    scenseSwitch(){
        //
    }
    actionListner_okButton(){
        this.nextScense.scenseSwitch()
    }
}
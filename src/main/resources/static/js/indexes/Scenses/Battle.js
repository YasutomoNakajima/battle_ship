import {Scense} from "./Scense.js";

export class Battle extends Scense {
    myTurn(){
        this.nextScense.scenseSwitch()
        this.enemyTurn()
    }
    enemyTurn() {
        this.nextScense.scenseSwitch()
        this.myTurn()
    }
}

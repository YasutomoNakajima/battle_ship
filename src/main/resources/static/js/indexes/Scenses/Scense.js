export class Scense{

    static APP_STATE
    static NEXT_SCENSE

    constructor(appState){
        Scense.APP_STATE = appState
    }
    setNextScense(nextScense){
        Scense.NEXT_SCENSE = nextScense
    }
}
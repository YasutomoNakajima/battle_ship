import {AppState} from "./Scenses/AppState.js";
import {Title} from "./Scenses/Title.js";
import {MainMenu} from "./Scenses/MainMenu.js";
import {StandBy} from "./Scenses/StandBy.js";
import {Battle} from "./Scenses/Battle.js";
import {Result} from "./Scenses/Result.js";

function main() {
    const appState = new AppState()
    const title = new Title(appState)
    const mainMenu = new MainMenu(appState)
    const standBy = new StandBy(appState)
    const battle = new Battle(appState)
    const result = new Result(appState)

    title.setNextScense(mainMenu)
    mainMenu.setNextScense(standBy)
    standBy.setNextScense(battle)
    battle.setNextScense(result)
    result.setNextScense(mainMenu)

    title.drawScense()
}

main()
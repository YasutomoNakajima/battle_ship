import {Stage} from "./Components/Stage.js";
import {BackGround} from "./Components/BackGround.js";
import {StartImage} from "./Components/StartImage.js";

const ext_stage = class extends Stage{}
const ext_bg = class extends BackGround{}

const Components = {
    Stage: ext_stage,
    BackGround: ext_bg,
    StartImage: StartImage
}
export {Components}
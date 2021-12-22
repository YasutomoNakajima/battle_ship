import {TitleImage} from "./Components/TitleImage.js";

export class TitleView {
    constructor(al){

        this.titleImage = new TitleImage(al)
        this.main = this.titleImage.get_component()
    }
}
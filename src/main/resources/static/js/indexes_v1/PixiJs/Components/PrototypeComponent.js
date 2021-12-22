export class PrototypeComponent {

    static WIDTH = 1440
    static HEIGHT = 810

    constructor(){
        this._component = this._create()
    }

    _create(){return new Object}

    get_component(){
        return this._component
    }

    add(component){
        this._component.addChild(component.get_component())
    }

    remove(component){
        this._component.removeChild(component.get_component())
    }
}
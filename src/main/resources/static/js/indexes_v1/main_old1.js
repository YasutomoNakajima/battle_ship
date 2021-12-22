import {Components} from "./PixiJs/Components.js";

class Main_old1 {
    constructor(){
        this.game_end = false
        this.stage = new Components.Stage()
        this.back_ground = new Components.BackGround()
        this.start_image = new Components.StartImage()
    }
    _awake() {
    }
    hoge() {
        return new Promise(resolve => {
            while (!this.start_image.clicked_q()){console.log("holleaaaaaaa")}
            return 5
        })
    }
    _start() {
        this.stage.add(this.back_ground)
        this.stage.add(this.start_image)
        this.stage.redraw()
        console.log("holle")
        //while (!this.start_image.clicked_q()){}
        this.stage.remove(this.start_image)
        this.stage.redraw()
    }
    async fuga() {
        const result = await hoge();
        return result + 5;
    }

    _loop() {
        while (!this.game_end) {
            this.game_end = true
        }
    }

    _sync(func){
        const fetchData = async (func) => {
            const resp = await func()
        }
    }

    do() {
        this._awake()
        this._start()
        this._loop()
    }
}

//var application = new Main_old1()
//application.do()
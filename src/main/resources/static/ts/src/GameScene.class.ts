///<reference path="../lib/node_modules/@types/jquery/JQuery.d.ts" />
///<reference path="../lib/node_modules/pixi.js/pixi.js.d.ts" />

module tuto.Ezelia {

    export class Scene extends PIXI.Container {
        private paused: Boolean = false;
        private updateCB = function () { };

        constructor() {
            super();
        }
        public onUpdate(updateCB: () => void ) {
            this.updateCB = updateCB;
        }

        public update() {
            this.updateCB();
        }
        public pause() {
            this.paused = true;
        }
        public resume() {
            this.paused = false;
        }
        public isPaused() {
            return this.paused;
        }

    }

}
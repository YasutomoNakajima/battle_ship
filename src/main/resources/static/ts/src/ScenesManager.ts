///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\@types\jquery\JQuery.d.ts" />
///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\pixi.js\pixi.js.d.ts" />
///<reference path="GameScene.class.ts" />

// Module
module tuto.Ezelia {
    export class ScenesManager {
        private static scenes: any = {}; // should be hashmap but a JS object is fine too :)
        public static currentScene: Scene;
        public static renderer: PIXI.Renderer;
        public static loader: any;

        public static appSizeWidth: number;
        public static appSizeHeight: number;

        public static create(width: number, height: number) {
            if (ScenesManager.renderer) return this;

            this.appSizeWidth = width;
            this.appSizeHeight = height;

            var params = {
                width: width,
                height: height,
                backgroundColor: 0xe0ffff   // 背景色の指定（灰色）
            }
            ScenesManager.renderer = PIXI.autoDetectRenderer(params);
            //document.body.appendChild(ScenesManager.renderer.view);
            $("p").append(ScenesManager.renderer.view)

            requestAnimationFrame(ScenesManager.loop);
            return this;
        }
        private static loop() {
            requestAnimationFrame(function () { ScenesManager.loop() });

            if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused()) return;
            ScenesManager.currentScene.update();
            ScenesManager.renderer.render(ScenesManager.currentScene);
        }

        public static createScene(id: string): Scene {
            if (ScenesManager.scenes[id]) return undefined;

            var scene = new Scene();
            ScenesManager.scenes[id] = scene;

            return scene;
        }

        public static deleteScene(id: string) {
            if (!ScenesManager.scenes[id]) return;
            delete ScenesManager.scenes[id];
        }

        public static goToScene(id: string): boolean {

            if (ScenesManager.scenes[id]) {
                if (ScenesManager.currentScene) ScenesManager.currentScene.pause();
                ScenesManager.currentScene = ScenesManager.scenes[id];
                ScenesManager.currentScene.resume();
                return true;
            }
            console.log("The scene named \"", id, "\" was not found")
            return false;
        }
    }
}
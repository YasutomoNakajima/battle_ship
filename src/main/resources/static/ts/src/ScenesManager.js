///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\@types\jquery\JQuery.d.ts" />
///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\pixi.js\pixi.js.d.ts" />
///<reference path="GameScene.class.ts" />
// Module
var tuto;
(function (tuto) {
    var Ezelia;
    (function (Ezelia) {
        var ScenesManager = /** @class */ (function () {
            function ScenesManager() {
            }
            ScenesManager.create = function (width, height) {
                if (ScenesManager.renderer)
                    return this;
                this.appSizeWidth = width;
                this.appSizeHeight = height;
                var params = {
                    width: width,
                    height: height,
                    backgroundColor: 0xe0ffff // 背景色の指定（灰色）
                };
                ScenesManager.renderer = PIXI.autoDetectRenderer(params);
                //document.body.appendChild(ScenesManager.renderer.view);
                $("p").append(ScenesManager.renderer.view);
                requestAnimationFrame(ScenesManager.loop);
                return this;
            };
            ScenesManager.loop = function () {
                requestAnimationFrame(function () { ScenesManager.loop(); });
                if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused())
                    return;
                ScenesManager.currentScene.update();
                ScenesManager.renderer.render(ScenesManager.currentScene);
            };
            ScenesManager.createScene = function (id) {
                if (ScenesManager.scenes[id])
                    return undefined;
                var scene = new Ezelia.Scene();
                ScenesManager.scenes[id] = scene;
                return scene;
            };
            ScenesManager.deleteScene = function (id) {
                if (!ScenesManager.scenes[id])
                    return;
                delete ScenesManager.scenes[id];
            };
            ScenesManager.goToScene = function (id) {
                if (ScenesManager.scenes[id]) {
                    if (ScenesManager.currentScene)
                        ScenesManager.currentScene.pause();
                    ScenesManager.currentScene = ScenesManager.scenes[id];
                    ScenesManager.currentScene.resume();
                    return true;
                }
                console.log("The scene named \"", id, "\" was not found");
                return false;
            };
            ScenesManager.scenes = {}; // should be hashmap but a JS object is fine too :)
            return ScenesManager;
        }());
        Ezelia.ScenesManager = ScenesManager;
    })(Ezelia = tuto.Ezelia || (tuto.Ezelia = {}));
})(tuto || (tuto = {}));

///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../GameParameters.ts" />
///<reference path="../CreateComponent.ts" />
var Create;
(function (Create) {
    var Scene;
    (function (Scene) {
        function Result(sceneManager) {
            var scene = sceneManager.createScene('result');
            var background = createBackground();
            var button = createButton(sceneManager);
            scene.addChild(button);
        }
        Scene.Result = Result;
        function createBackground() {
            var background;
            return background;
        }
        function createButton(sceneManager) {
            var button = Create.Component.button();
            button
                .on('pointerdown', function () {
                GameParameters.Status.reset();
                sceneManager.deleteScene('standBy');
                sceneManager.deleteScene('battle');
                createjs.Sound.play("title", { loop: -1, volume: 0.05 });
                sceneManager.goToScene('home');
            });
            return button;
        }
    })(Scene = Create.Scene || (Create.Scene = {}));
})(Create || (Create = {}));

///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../GameParameters.ts" />
///<reference path="../CreateComponent.ts" />

module Create.Scene{
    export function Result(sceneManager) {
        var scene = sceneManager.createScene('result');
        var background = createBackground();
        var button = createButton(sceneManager);

        scene.addChild(button);
    }

    function createBackground() {
        var background: any;
        return background
    }

    function createButton(sceneManager) {
        var button = Create.Component.button();
        button
            .on('pointerdown', function () {
                GameParameters.Status.reset();
                sceneManager.deleteScene('standBy');
                sceneManager.deleteScene('battle');
                createjs.Sound.play("title", {loop: -1, volume: 0.05});
                sceneManager.goToScene('home');
            });
        return button
    }
}
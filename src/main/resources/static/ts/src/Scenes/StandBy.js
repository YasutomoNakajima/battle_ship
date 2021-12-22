///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../GameParameters.ts" />
///<reference path="../CreateComponent.ts" />
///<reference path="Battle.ts" />
///<reference path="../Ajax.ts" />
var Create;
(function (Create) {
    var Scene;
    (function (Scene) {
        function StandBy(sceneManager) {
            Components.scenesManager = sceneManager;
            Components.scene = sceneManager.createScene('standBy');
            Components.scene.onUpdate(animation);
            Components.mapStage = createMap();
            Components.fleetIconsStage = createFleetIcons();
            Components.blankButton = createButton(sceneManager);
            Components.faceIcon = Create.Component.faceIcons(sceneManager);
            createTextField();
            createFlagshipImage();
            Components.scene.addChild(createBackgrund());
            Components.scene.addChild(Components.mapStage);
            Components.scene.addChild(Components.flagshipImage);
            Components.scene.addChild(Components.fleetIconsStage);
            Components.scene.addChild(Components.blankButton);
            Components.scene.addChild(Components.textField);
        }
        Scene.StandBy = StandBy;
        var Components = /** @class */ (function () {
            function Components() {
            }
            Components.map = new Array();
            Components.fleetIcons = new Array();
            Components.faceIcon = new Array();
            return Components;
        }());
        function createBackgrund() {
            var background;
            var texture;
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/result.jpg');
                background = new PIXI.Sprite(texture);
            });
            return background;
        }
        function createMessage() {
            Components.message = Create.Component.standbyMessage();
            Components.message.x -= 300;
            Components.message.y = 248;
            Components.scene.addChild(Components.message);
            Components.message2 = Create.Component.standbyMessage2(Components.scenesManager);
        }
        Scene.createMessage = createMessage;
        function createFlagshipImage() {
            Components.flagshipImage = Create.Component.fleetGigImage(Components.scenesManager)[0];
            Components.flagshipImage.y = GameParameters.Component.APP_HEIGHT / 8;
            Components.flagshipImage.x = 8;
        }
        Scene.createFlagshipImage = createFlagshipImage;
        function createTextField() {
            Components.textField = Create.Component.textField();
            var text = Create.Component.informationHeader("艦隊を配置してください");
            text.y = 30;
            text.x = 400;
            Components.textField.addChild(text);
            Components.textField.y = GameParameters.Component.APP_HEIGHT - 140;
        }
        Scene.createTextField = createTextField;
        function createMap() {
            // マップ
            var mapStage = new PIXI.Container();
            var map = Create.Component.map();
            for (var y = 0; y < 5; y++) {
                for (var x = 0; x < 5; x++) {
                    map[y][x]
                        .on('pointerdown', mapAL_down)
                        .on('pointerover', mapAL_over)
                        .on('pointerout', mapAL_out);
                    //function () {this.alpha = GameParameters.Component.DEFAULT_ALPHA;});
                    mapStage.addChild(map[y][x]);
                }
            }
            Components.map = map;
            mapStage.y -= 30;
            mapStage.x += 90;
            return mapStage;
        }
        Scene.createMap = createMap;
        function createFleetIcons() {
            var fleetIconsStage = new PIXI.Container();
            // 艦隊情報
            var fleetIcons = Create.Component.fleetIcons(Components.scenesManager);
            for (var i = 0; i < 3; i++) {
                fleetIcons[i].on('pointerdown', fleetIconsAL);
                if (i == 0) {
                    fleetIcons[0].alpha = 1;
                    GameParameters.Status.selectedFleetIcon.id = 0;
                }
                fleetIcons[i].x = GameParameters.Component.APP_WIDTH - 275;
                fleetIcons[i].y += 40;
                fleetIconsStage.addChild(fleetIcons[i]);
            }
            Components.fleetIcons = fleetIcons;
            return fleetIconsStage;
        }
        function createButton(scenesManager) {
            var buttonX = 291;
            // ブランクボタン
            var blankButton = PIXI.Sprite.from("sally_sortie_21");
            blankButton.x = GameParameters.Component.APP_WIDTH - buttonX;
            blankButton.y = 380;
            // 決定/キャンセルボタン
            var button = Create.Component.shutugekiButton();
            button.x = GameParameters.Component.APP_WIDTH - buttonX;
            button.y = 380;
            button
                .on('pointerdown', function () {
                if (Components.fleetIcons[0].putPos[0] == -1 || Components.fleetIcons[1].putPos[0] == -1 || Components.fleetIcons[2].putPos[0] == -1) {
                    console.log("配置が完了していません");
                    return;
                }
                Components.scene.removeChild(Components.blankButton);
                Components.scene.removeChild(Components.button);
                Components.scene.removeChild(Components.mapStage);
                Components.scene.removeChild(Components.fleetIconsStage);
                createMessage();
                Iterator.i = 0;
                Iterator.j = 0;
                GameParameters.Status.callAnimationId = 'shutugeki2';
                for (var i = 0; i < 3; i++) {
                    GameParameters.Status.fleetPosition[i].position[0] = Components.fleetIcons[i].putPos[0];
                    GameParameters.Status.fleetPosition[i].position[1] = Components.fleetIcons[i].putPos[1];
                }
            });
            Components.button = button;
            return blankButton;
        }
        Scene.createButton = createButton;
        function mapAL_down() {
            var selectedFleetIconId = GameParameters.Status.selectedFleetIcon.id;
            //現在選択されているマップの座標上にいずれかの艦があればreturn
            if (this.fleet >= 0) {
                //print_text(18)
                return;
            }
            var position = Components.fleetIcons[selectedFleetIconId].putPos;
            if (position[0] != -1) {
                Components.map[position[0]][position[1]].fleet = -1;
                Components.map[position[0]][position[1]].alpha = GameParameters.Component.DEFAULT_ALPHA;
                Components.map[position[0]][position[1]].removeChild(Components.faceIcon[selectedFleetIconId]);
                Components.fleetIcons[selectedFleetIconId].putPos = [-1, -1];
            }
            this.fleet = selectedFleetIconId;
            this.alpha = 1;
            this.addChild(Components.faceIcon[selectedFleetIconId]);
            Components.fleetIcons[selectedFleetIconId].putPos = this.position_;
            if (Components.fleetIcons[0].putPos[0] != -1 && Components.fleetIcons[1].putPos[0] != -1 && Components.fleetIcons[2].putPos[0] != -1) {
                Components.scene.removeChild(Components.blankButton);
                Components.scene.addChild(Components.button);
            }
        }
        function mapAL_over() {
            //
        }
        function mapAL_out() {
            //
        }
        function fleetIconsAL() {
            Components.fleetIcons[GameParameters.Status.selectedFleetIcon.id].alpha = GameParameters.Component.DEFAULT_ALPHA;
            GameParameters.Status.selectedFleetIcon.id = this.id;
            this.alpha = 1;
        }
        function animation() {
            if (GameParameters.Status.callAnimationId == 'shutugeki2')
                shutugeki();
        }
        var Iterator = /** @class */ (function () {
            function Iterator() {
            }
            return Iterator;
        }());
        function shutugeki() {
            Iterator.i += 1;
            if (Iterator.i < 30)
                return;
            Components.message.children[0].children[0].x -= 10;
            Components.message.children[0].children[0].alpha -= 0.04;
            if (Iterator.i < 50)
                return;
            Components.textField.y += 14;
            Components.textField.alpha -= 0.06;
            Components.flagshipImage.x -= 10;
            Components.flagshipImage.alpha -= 0.06;
            Components.message.children[0].alpha -= 0.1;
            if (Components.textField.alpha == -0.02) {
                Components.scene.removeChild(Components.message);
                return;
            }
            if (Iterator.i < 120)
                return;
            else if (Iterator.i == 120) {
                Components.scene.addChild(Components.message2);
                return;
            }
            else if (Iterator.i <= 230 && Components.message2.alpha <= 1) {
                Components.message2.alpha += 0.06;
                return;
            }
            else if (Iterator.i > 230 && Components.message2.alpha >= 0) {
                Components.message2.alpha -= 0.06;
                return;
            }
            else if (Iterator.i < 300)
                return;
            if (Components.textField.alpha < -0.04) {
                GameParameters.Status.callAnimationId = 'none';
                //Components.scene.addChild(Components.stagePanel);
                $.when(Ajax.post('api_stand_by', GameParameters.Status.fleetPosition)
                    .done(function (result) {
                    GameParameters.Status.actionPossibleArea = result;
                }))
                    .done(function () {
                    GameParameters.Status.selectedFleetIcon.id = -1;
                    //createjs.Sound.play("battle", {loop: -1, volume: 0});
                    Create.Scene.Battle(Components.scenesManager);
                    Components.scenesManager.goToScene('battle');
                });
                return;
            }
        }
    })(Scene = Create.Scene || (Create.Scene = {}));
})(Create || (Create = {}));

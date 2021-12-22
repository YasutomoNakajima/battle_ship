///<reference path="D:\Documents\java\web_sys_prog\battleship_task\battleship_spring\src\main\resources\static\ts\lib\node_modules\@types\jquery\JQuery.d.ts" />
///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../GameParameters.ts" />
///<reference path="../CreateComponent.ts" />
///<reference path="StandBy.ts" />
///<reference path="../Ajax.ts" />
///<reference path="../../lib/node_modules/@types/createjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/easeljs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/preloadjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/soundjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/tweenjs/index.d.ts" />
var Create;
(function (Create) {
    var Scene;
    (function (Scene) {
        function Home(scenesManager) {
            //scenesManager.deleteScene('result');
            Components.scenesManager = scenesManager;
            Components.scene = scenesManager.createScene('home');
            Components.scene.onUpdate(animation);
            Components.leftStage = new PIXI.Container();
            var mailIcon = createMailIcon();
            var scoreIcon = createScoreIcon();
            var settingIcon = createSettingIcon();
            Components.upFrame = createUpFrame();
            var playerStatusText = createPlayerStatusText();
            Components.upFrame.addChild(playerStatusText);
            Components.sallySortie = Create.Component.sallySorties();
            createStagePanel();
            createStagePanel2();
            createInformationPanel(scenesManager);
            createScorePanel(scenesManager);
            createSettingsPanel(scenesManager);
            var background = createBackgrund();
            var buttons = createButtons(scenesManager);
            var buttonsContainer = new Array();
            Components.buttonsStage = new PIXI.Container();
            Components.char = createChar();
            Components.leftStage.addChild(Components.char);
            Components.leftStage.addChild(mailIcon);
            Components.leftStage.addChild(settingIcon);
            Components.leftStage.addChild(scoreIcon);
            Components.scene.addChild(createBackgrund());
            var i = 0;
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var comp = buttons_1[_i];
                buttonsContainer[i] = new PIXI.Container();
                buttonsContainer[i].addChild(comp);
                Components.buttonsStage.addChild(buttonsContainer[i]);
                i += 1;
            }
            Components.scene.addChild(Components.buttonsStage);
            Components.scene.addChild(Components.leftStage);
            Components.scene.addChild(Components.upFrame);
            buttonActive(false);
            Components.scene.addChild(Components.informationPanel);
            var c = 10;
            //Components.scene.addChild(Create.Component.sallyMapParts()[15])
            //for(var i=0+c; i<9+c; i++) Components.scene.addChild(Create.Component.sallyMapParts()[i])
        }
        Scene.Home = Home;
        var Components = /** @class */ (function () {
            function Components() {
            }
            Components.sallySortie = new Array();
            return Components;
        }());
        function createBackgrund() {
            var background;
            var texture;
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/mainmenu.jpg');
                background = new PIXI.Sprite(texture);
            });
            return background;
        }
        function createStagePanel() {
            Components.stagePanel = Create.Component.stagePanel(Components.scenesManager);
            Components.backButton = Create.Component.backButton();
            Components.backButton.x -= 70;
            Components.backButton.y += 540;
            Components.backButton.on('pointerdown', function () {
                createjs.Sound.play("click1", { volume: GameParameters.Status.soundVolume["se"] });
                Components.stagePanel2.x = 1200;
                GameParameters.Status.selectStage = -1;
                Components.scene.removeChild(Components.stagePanel);
                GameParameters.Status.callAnimationId = 'back';
            });
            Components.stagePanel.addChild(Components.backButton);
            Components.sallySortie[14].y = GameParameters.Component.APP_HEIGHT / 2;
            for (var i = 0; i < 4; i++) {
                Components.stagePanel.children[i + 1].on('mouseover', function () {
                    this.children[0].alpha = 1;
                });
                Components.stagePanel.children[i + 1].on('mouseout', function () {
                    this.children[0].alpha = 0;
                });
                Components.stagePanel.children[i + 1].on('pointerdown', function () {
                    if (GameParameters.Status.selectStage == -1) {
                        GameParameters.Status.selectStage = this.id;
                        GameParameters.Status.callAnimationId = 'stageSelect';
                    }
                    else {
                        GameParameters.Status.selectStage = -1;
                        GameParameters.Status.callAnimationId = 'stageSelect2';
                    }
                });
            }
        }
        function createStagePanel2() {
            //Components.stagePanel2 = Create.Component.stagePanel2(Components.scenesManager);
            Components.stagePanel2 = new PIXI.Container();
            var sprite = PIXI.Sprite.from("sally_common_28");
            sprite.scale.x = 1.2;
            sprite.scale.y = 1.06;
            Components.stagePanel2.y -= 2;
            Components.stagePanel2.addChild(sprite);
            var button = Create.Component.decisionButton();
            button.x = 34;
            button.y = 492;
            button.on('pointerdown', function () {
                componentsReset();
                $.when(Ajax.get('api_begin_game')).done(function () {
                    Components.stagePanel2.x = 1200;
                    GameParameters.Status.selectStage = -1;
                    Components.scene.removeChild(Components.stagePanel);
                    GameParameters.Status.callAnimationId = 'none';
                    createjs.Sound.stop();
                    Create.Scene.StandBy(Components.scenesManager);
                    Components.scenesManager.goToScene('standBy');
                });
            });
            Components.stagePanel2.addChild(button);
            Components.stagePanel2.x = 1200;
            Components.stagePanel.addChild(Components.stagePanel2);
            Create.Component.decisionButton();
        }
        function createInformationPanel(scenesManager) {
            var panel = Create.Component.informationPanel(scenesManager);
            panel.children[1].on('pointerdown', function () {
                buttonActive(true);
                Components.scene.removeChild(Components.informationPanel);
            });
            panel.addChild(Create.Component.informationHeader("お知らせ"));
            panel.addChild(Create.Component.informationText("現在αテスト期間です。\nバグ報告はサイト左下のメールフォームからお願いします。"));
            Components.informationPanel = panel;
        }
        function createScorePanel(scenesManager) {
            var panel = Create.Component.informationPanel(scenesManager);
            panel.children[1].on('pointerdown', function () {
                buttonActive(true);
                Components.scene.removeChild(Components.scorePanel);
                Components.scorePanel.removeChildAt(3);
            });
            panel.addChild(Create.Component.informationHeader("直近の戦績"));
            Components.scorePanel = panel;
        }
        function createSettingsPanel(scenesManager) {
            var panel = Create.Component.informationPanel(scenesManager);
            panel.children[1].on('pointerdown', function () {
                buttonActive(true);
                Components.scene.removeChild(Components.settingsPanel);
            });
            panel.addChild(Create.Component.informationHeader("設定"));
            panel.addChild(Create.Component.informationText("準備中"));
            Components.settingsPanel = panel;
        }
        function createButtons(scenesManager) {
            var buttons = new Array();
            var texture;
            var polys = new Array();
            var points = new Array();
            var points1 = new Array();
            points1[0] = new PIXI.Point(680, 124);
            points1[1] = new PIXI.Point(740, 274);
            points1[2] = new PIXI.Point(1139, 260);
            points1[3] = new PIXI.Point(1194, 62);
            var points2 = new Array();
            points2[0] = new PIXI.Point(730, 285);
            points2[1] = new PIXI.Point(804, 510);
            points2[2] = new PIXI.Point(934, 475);
            points2[3] = new PIXI.Point(811, 283);
            var points3 = new Array();
            points3[0] = new PIXI.Point(891, 282);
            points3[1] = new PIXI.Point(942, 479);
            points3[2] = new PIXI.Point(1102, 437);
            points3[3] = new PIXI.Point(1143, 269);
            var points4 = new Array();
            points4[0] = new PIXI.Point(806, 524);
            points4[1] = new PIXI.Point(832, 602);
            points4[2] = new PIXI.Point(1072, 569);
            points4[3] = new PIXI.Point(1112, 445);
            points[0] = points1;
            points[1] = points4;
            points[2] = points3;
            points[3] = points2;
            var i = 0;
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var point = points_1[_i];
                polys[i] = new PIXI.Polygon(point[0], point[1], point[2], point[3]);
                i += 1;
            }
            scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/home/出撃ボタン.png');
                buttons[0] = new PIXI.Sprite(texture);
                texture = PIXI.Texture.from('/images/home/編隊ボタン.png');
                buttons[1] = new PIXI.Sprite(texture);
                texture = PIXI.Texture.from('/images/home/整備ボタン.png');
                buttons[2] = new PIXI.Sprite(texture);
                texture = PIXI.Texture.from('/images/home/開発ボタン.png');
                buttons[3] = new PIXI.Sprite(texture);
                i = 0;
                for (var _i = 0, buttons_2 = buttons; _i < buttons_2.length; _i++) {
                    var comp = buttons_2[_i];
                    comp.position.x += GameParameters.Component.HOME_BUTTONS_BASE_POSITION_X;
                    comp.position.y += GameParameters.Component.HOME_BUTTONS_BASE_POSITION_Y;
                    comp.interactive = true;
                    comp.buttonMode = true;
                    comp.hitArea = polys[i];
                    comp.on('mouseover', buttonOver);
                    comp.on('mouseout', buttonOut);
                    i += 1;
                }
            });
            buttons[0].on('pointerdown', function () {
                createjs.Sound.play("click1", { volume: GameParameters.Status.soundVolume["se"] });
                if (GameParameters.Status.fleet[0]["hp"] == 0 || GameParameters.Status.fleet[1]["hp"] == 0 || GameParameters.Status.fleet[2]["hp"] == 0) {
                    console.log("大破している艦がいます\n修理を行ってください");
                    return;
                }
                GameParameters.Status.callAnimationId = 'shutugeki';
            });
            return buttons;
        }
        function createButton(sceneManager) {
            var button = Create.Component.button();
            return button;
        }
        function createChar() {
            var texture;
            var sprite;
            var stage = new PIXI.Container();
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/char/' + GameParameters.Status.teamLeader + '.png');
                sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5);
            });
            stage.addChild(sprite);
            stage.scale.x = 0.7;
            stage.scale.y = 0.7;
            stage.position.x = GameParameters.Component.APP_WIDTH / 3;
            stage.position.y = GameParameters.Component.APP_HEIGHT / 2 + 82;
            return stage;
        }
        function createMailIcon() {
            var texture;
            var sprite;
            var stage = new PIXI.Container();
            var points = new Array();
            points[0] = new PIXI.Point(75 + 8, 118 - 46);
            points[1] = new PIXI.Point(100 + 8, 156 - 46);
            points[2] = new PIXI.Point(87 + 8, 198 - 46);
            points[3] = new PIXI.Point(22 + 8, 174 - 46);
            points[4] = new PIXI.Point(35 + 8, 132 - 46);
            var poly = new PIXI.Polygon(points[0], points[1], points[2], points[3], points[4]);
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/home/お知らせアイコン.png');
                sprite = new PIXI.Sprite(texture);
                sprite.position.x = 8;
                sprite.position.y = 46;
                sprite.interactive = true;
                sprite.buttonMode = true;
                sprite.hitArea = poly;
                sprite.on('mouseover', function () {
                    this.parent.scale.x = 1.02;
                    this.parent.scale.y = 1.02;
                    this.parent.position.x = -2;
                    this.parent.position.y = -3;
                });
                sprite.on('mouseout', function () {
                    this.parent.position.x = 0;
                    this.parent.position.y = 0;
                    this.parent.scale.x = 1;
                    this.parent.scale.y = 1;
                });
                sprite.on('pointerdown', function () {
                    buttonActive(false);
                    Components.scene.addChild(Components.informationPanel);
                });
            });
            stage.addChild(sprite);
            return stage;
        }
        function createUpFrame() {
            var texture;
            var sprite;
            var stage = new PIXI.Container();
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/home/upFrame.png');
                sprite = new PIXI.Sprite(texture);
            });
            stage.addChild(sprite);
            return stage;
        }
        function createSettingIcon() {
            var texture;
            var sprite;
            var stage = new PIXI.Container();
            var points = new Array();
            points[0] = new PIXI.Point(45 + 872, 355 + 254);
            points[1] = new PIXI.Point(78 + 872, 355 + 254);
            points[2] = new PIXI.Point(108 + 872, 402 + 254);
            points[3] = new PIXI.Point(94 + 872, 432 + 254);
            points[4] = new PIXI.Point(81 + 872, 440 + 254);
            points[5] = new PIXI.Point(33 + 872, 442 + 254);
            points[6] = new PIXI.Point(7 + 872, 415 + 254);
            points[7] = new PIXI.Point(7 + 872, 386 + 254);
            var poly = new PIXI.Polygon(points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7]);
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/home/setting.png');
                sprite = new PIXI.Sprite(texture);
                sprite.position.x = -872;
                sprite.position.y = -254;
                sprite.interactive = true;
                sprite.buttonMode = true;
                //sprite.on('pointerdown',function (e) {console.log(e.data.global);})
                sprite.hitArea = poly;
                sprite.on('mouseover', function () {
                    this.parent.scale.x = 1.015;
                    this.parent.scale.y = 1.015;
                    this.parent.position.x = -2;
                    this.parent.position.y = -5;
                });
                sprite.on('mouseout', function () {
                    this.parent.scale.x = 1;
                    this.parent.scale.y = 1;
                    this.parent.position.x = 0;
                    this.parent.position.y = 0;
                });
                sprite.on('pointerdown', function () {
                    buttonActive(false);
                    Components.scene.addChild(Components.settingsPanel);
                });
            });
            stage.addChild(sprite);
            return stage;
        }
        function createScoreIcon() {
            var texture;
            var sprite;
            var stage = new PIXI.Container();
            var points = new Array();
            points[0] = new PIXI.Point(29 + 136, 244 + 374);
            points[1] = new PIXI.Point(78 + 136, 243 + 374);
            points[2] = new PIXI.Point(81 + 136, 267 + 374);
            points[3] = new PIXI.Point(96 + 136, 277 + 374);
            points[4] = new PIXI.Point(82 + 136, 294 + 374);
            points[5] = new PIXI.Point(84 + 136, 326 + 374);
            points[6] = new PIXI.Point(56 + 136, 319 + 374);
            points[7] = new PIXI.Point(33 + 136, 322 + 374);
            points[8] = new PIXI.Point(30 + 136, 299 + 374);
            points[9] = new PIXI.Point(16 + 136, 275 + 374);
            points[10] = new PIXI.Point(24 + 136, 265 + 374);
            var poly = new PIXI.Polygon(points[0], points[1], points[2], points[3], points[4], points[5], points[6], points[7], points[8], points[9], points[10]);
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/home/score.png');
                sprite = new PIXI.Sprite(texture);
                sprite.position.x = -136;
                sprite.position.y = -374;
                sprite.interactive = true;
                sprite.buttonMode = true;
                sprite.hitArea = poly;
                sprite.on('mouseover', function () {
                    this.parent.scale.x = 1.02;
                    this.parent.scale.y = 1.02;
                    this.parent.position.x = -2;
                    this.parent.position.y = -5;
                });
                sprite.on('mouseout', function () {
                    this.parent.scale.x = 1;
                    this.parent.scale.y = 1;
                    this.parent.position.x = 0;
                    this.parent.position.y = 0;
                });
                sprite.on('pointerdown', function () {
                    buttonActive(false);
                    $.when(renderScorePanel()).done(function () {
                        $.ajax({
                            url: 'api_battle_logs',
                            async: true,
                            type: 'GET',
                            dataType: "json"
                        })
                            .done(function (data) {
                            Components.scorePanel.removeChildAt(3);
                            Components.scorePanel.addChild(Create.Component.scoreText(data));
                        });
                    });
                });
            });
            stage.addChild(sprite);
            return stage;
        }
        function renderScorePanel() {
            Components.scene.addChild(Components.scorePanel);
            Components.scorePanel.addChild(Create.Component.informationText("読み込み中..."));
            Components.scenesManager.renderer.render(Components.scenesManager.currentScene);
        }
        function createPlayerStatusText() {
            // タイトル
            var style0 = new PIXI.TextStyle({
                fontSize: 24,
                //fontWeight: "bold",
                fill: 0xffffff,
                fontFamily: "hm_tb"
            });
            var playerStatusText = new PIXI.Text('提督Level：' +
                GameParameters.Status.player['level'] + '\n' +
                GameParameters.Status.player['name'], style0);
            //title.anchor.set(0.5)     // 基準点をスプライトの中心にセットする
            playerStatusText.x = 20;
            playerStatusText.y = 16;
            return playerStatusText;
        }
        function buttonActive(flag) {
            for (var i = 0; i < Components.buttonsStage.children.length; i++) {
                Components.buttonsStage.children[i].children[0].interactive = flag;
            }
            for (var i = 0; i < Components.leftStage.children.length - 1; i++) {
                Components.leftStage.children[i + 1].children[0].interactive = flag;
            }
        }
        function buttonOver() {
            this.parent.scale.x = 1.01;
            this.parent.scale.y = 1.01;
            this.parent.position.x = -10;
            this.parent.position.y = -4;
        }
        function buttonOut() {
            this.parent.position.x = 0;
            this.parent.position.y = 0;
            this.parent.scale.x = 1;
            this.parent.scale.y = 1;
        }
        function animation() {
            if (GameParameters.Status.callAnimationId == 'shutugeki')
                shutugeki();
            else if (GameParameters.Status.callAnimationId == 'stageSelect')
                stageSelect();
            else if (GameParameters.Status.callAnimationId == 'stageSelect2')
                stageSelect2();
            else if (GameParameters.Status.callAnimationId == 'back')
                back();
        }
        function stageSelect() {
            if (Components.stagePanel2.x <= 740) {
                GameParameters.Status.callAnimationId = 'none';
                return;
            }
            Components.stagePanel2.x -= 30;
        }
        function stageSelect2() {
            if (Components.stagePanel2.x >= 1200) {
                Components.stagePanel2.x = 1200;
                GameParameters.Status.callAnimationId = 'none';
                return;
            }
            Components.stagePanel2.x += 40;
        }
        function shutugeki() {
            Components.buttonsStage.position.x += 14;
            Components.buttonsStage.alpha -= 0.04;
            Components.leftStage.position.x -= 10;
            Components.leftStage.alpha -= 0.04;
            //Components.upFrame.position.y -= 14;
            if (Components.buttonsStage.alpha < -0.04) {
                GameParameters.Status.callAnimationId = 'none';
                Components.scene.addChild(Components.stagePanel);
                return;
            }
        }
        function back() {
            Components.buttonsStage.position.x -= 14;
            Components.buttonsStage.alpha += 0.04;
            Components.leftStage.position.x += 10;
            Components.leftStage.alpha += 0.04;
            //Components.upFrame.position.y -= 14;
            if (Components.buttonsStage.alpha >= 1) {
                GameParameters.Status.callAnimationId = 'none';
                return;
            }
        }
        function componentsReset() {
            Components.buttonsStage.position.x = 0;
            Components.buttonsStage.alpha = 1;
            Components.leftStage.position.x = 0;
            Components.leftStage.alpha = 1;
            Components.upFrame.position.y = 0;
        }
    })(Scene = Create.Scene || (Create.Scene = {}));
})(Create || (Create = {}));

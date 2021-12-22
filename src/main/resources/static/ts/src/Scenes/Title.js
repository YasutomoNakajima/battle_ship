///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../../lib/node_modules/@types/createjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/easeljs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/preloadjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/soundjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/tweenjs/index.d.ts" />
///<reference path="Home.ts" />
var Create;
(function (Create) {
    var Scene;
    (function (Scene) {
        function Title(sceneManager) {
            // タイトルステージ
            Components.scenesManager = sceneManager;
            Components.scene = sceneManager.createScene('title');
            Components.titleStage = new PIXI.Graphics();
            Components.titleStage.x = 0;
            Components.titleStage.y = 0;
            Components.titleStage.beginFill(0xfff55f);
            Components.titleStage.drawRect(0, 0, sceneManager.appSizeWidth, sceneManager.appSizeHeight);
            Components.titleStage.endFill();
            Components.titleStage.interactive = false;
            Components.titleStage.alpha = 1;
            // タイトルテキスト
            var style0 = new PIXI.TextStyle({
                fontSize: 100,
                fontWeight: "bold",
                fill: 0x000000,
                fontFamily: "hm_tb"
            });
            var text = new PIXI.Text(" - title - ", style0);
            text.anchor.set(0.5); // 基準点をスプライトの中心にセットする
            text.x = sceneManager.appSizeWidth / 2; // スプライトの座標をステージの中心にする
            text.y = sceneManager.appSizeHeight / 2;
            text.alpha = 1;
            Components.titleStage.addChild(text);
            // ローディングバー
            Iterator.i = 0;
            Iterator.j = 0;
            Iterator.k = 0;
            Components.loadBar = Create.Component.loadBar();
            /***      createjs TEST      ***/
            function init() {
                //オーディオファイルのロードが終了したならloadHandlerが呼ばれる
                createjs.Sound.addEventListener("fileload", loadHandler);
                //オーディオファイルを登録
                createjs.Sound.registerSound("/music/title.mp3", "title");
                createjs.Sound.registerSound("/music/battleBGM1.mp3", "battle");
                createjs.Sound.registerSound("/music/bep_t1.mp3", "sound01");
                createjs.Sound.registerSound("/music/bep_t2.mp3", "sound02");
                createjs.Sound.registerSound("/music/bep_t3.mp3", "sound03");
                createjs.Sound.registerSound("/SE/bu-n.mp3", "bu-n");
                createjs.Sound.registerSound("/SE/shu.mp3", "shu");
                createjs.Sound.registerSound("/SE/click1.mp3", "click1");
                createjs.Sound.registerSound("/SE/explosion1.mp3", "explosion1");
                createjs.Sound.registerSound("/SE/explosion2.mp3", "explosion2");
                createjs.Sound.registerSound("/SE/explosion3.mp3", "explosion3");
            }
            function loadHandler(event) {
                //音を出す
                //createjs.Sound.play("sound01");
            }
            var titleLoader = PIXI.loader;
            titleLoader
                .add("/images/titleImage2.png")
                .add("/json/SpriteSheet/title_main.json")
                //.add("/music/title.mp3")
                .load(function () {
                init();
                //$("div").html('<audio src="music/title.mp3" autoplay loop>あなたのブラウザーは <code>audio</code>要素をサポートしていません。</audio>');
                var texture = PIXI.Texture.from('/images/titleImage2.png');
                var sprite = new PIXI.Sprite(texture);
                sprite.scale.x = 0.86;
                sprite.scale.y = 0.86;
                sprite.x -= 30;
                sprite.y -= 4;
                Components.scene.addChild(Components.titleStage);
                Components.scene.addChild(sprite);
                Components.scene.addChild(Components.loadBar);
                createStartButton(sceneManager);
                Components.scene.addChild(Components.startButton);
                Components.scene.onUpdate(changeWidthLoadBar);
                sceneManager.loader
                    .add("/images/button.png")
                    .add("/images/091.png")
                    .add("/images/battle.jpg")
                    .add("/images/mainmenu.jpg")
                    .add("/images/result.jpg")
                    .add("/images/standBy.jpg")
                    .add("/images/home/出撃ボタン.png")
                    .add("/images/home/編隊ボタン.png")
                    .add("/images/home/整備ボタン.png")
                    .add("/images/home/開発ボタン.png")
                    .add("/images/home/score.png")
                    .add("/images/home/upFrame.png")
                    .add("/images/home/setting.png")
                    .add("/images/home/お知らせアイコン.png")
                    .add("/images/char/hibiki.png")
                    .add("/images/char/hibiki_b.png")
                    .add("/images/char/bep_b.png")
                    .add("/images/char/i168_b.png")
                    .add("/images/char/kirishima_b.png")
                    .add("/images/char/bep_c.png")
                    .add("/images/char/i168_c.png")
                    .add("/images/char/kirishima_c.png")
                    .add("/images/char/bep_d.png")
                    .add("/images/char/i168_d.png")
                    .add("/images/char/kirishima_d.png")
                    .add("/images/char/bep.png")
                    .add("/images/char/1501.png")
                    .add("/images/char/1501_b.png")
                    .add("/images/char/1501_c.png")
                    .add("/images/char/bep_big.png")
                    .add("/images/char/i168_big.png")
                    .add("/images/char/kirishima_big.png")
                    .add("/images/char/gekitin.png")
                    .add("/images/message/battle_start.png")
                    .add("/images/stages/01.png")
                    .add("/images/stages/02.png")
                    .add("/images/stages/03.png")
                    .add("/images/stages/04.png")
                    .add("/images/mes_bg_e.png")
                    .add("/images/mes_f_hbg.png")
                    .add("/json/SpriteSheet/sally_sortie.json")
                    .add("/json/SpriteSheet/sally_common.json")
                    .add("/json/SpriteSheet/sally_map_parts.json")
                    .add("/json/SpriteSheet/map_common.json")
                    .add("/json/SpriteSheet/explosion.json")
                    .load(function () {
                    Components.startButton.children[0].interactive = true;
                    Components.startButton.children[0].buttonMode = true;
                    /***for(var i=0; i<1; i++){
                        var a = Create.Component.mapCommon()[i+114];
                        a.x = i*120;
                        a.y = i*72;
                        Components.scene.addChild(a)
                    }***/
                });
            });
        }
        Scene.Title = Title;
        var Components = /** @class */ (function () {
            function Components() {
            }
            return Components;
        }());
        var Iterator = /** @class */ (function () {
            function Iterator() {
            }
            return Iterator;
        }());
        function changeWidthLoadBar() {
            if (Iterator.k == 100) {
                blackScreen();
                return;
            }
            if (Iterator.i == 200) {
                titleParts();
                return;
            }
            else if (Iterator.i >= 100) {
                if (Iterator.i != 100 && Iterator.j != 100) {
                    Iterator.i = 100;
                    Iterator.j = 100;
                }
                else {
                    if (Iterator.k < 40) {
                        Iterator.k += 1;
                        return;
                    }
                    var titleLogo = PIXI.Sprite.from("title_main_3");
                    titleLogo.anchor.x = 0.5;
                    titleLogo.anchor.y = 0.5;
                    titleLogo.x = GameParameters.Component.APP_WIDTH / 2;
                    titleLogo.y = GameParameters.Component.APP_HEIGHT / 3;
                    Components.scene.addChild(titleLogo);
                    var text = Create.Component.titleText("～　WSPエディション　～");
                    Components.scene.addChild(text);
                    Components.scene.removeChild(Components.loadBar);
                    Iterator.i = 200;
                    return;
                }
            }
            var width = 1000 * Iterator.i / 100;
            Components.loadBar.children[0].width = width;
            if (Iterator.i > 40 && Iterator.j < 30)
                Iterator.j += 1;
            else if (Iterator.i > 60)
                Iterator.i += 2;
            else if (Iterator.i > 86)
                Iterator.i += 1.3;
            else
                Iterator.i += 1;
        }
        function titleParts() {
            if (Components.startButton.children[0].alpha >= 1)
                return;
            Components.startButton.children[0].alpha += 0.05;
            Components.startButton.y -= 2;
        }
        function createBlackScreen() {
            var stage = new PIXI.Container();
            var black = new PIXI.Graphics();
            black.beginFill(0x000000);
            black.drawRect(0, 0, GameParameters.Component.APP_WIDTH, GameParameters.Component.APP_HEIGHT);
            black.endFill();
            stage.addChild(black);
            var maru = PIXI.Sprite.from('title_main_0');
            maru.anchor.x = 0.5;
            maru.anchor.y = 0.5;
            maru.x = GameParameters.Component.APP_WIDTH / 2;
            maru.y = GameParameters.Component.APP_HEIGHT / 2;
            stage.addChild(maru);
            var fune = PIXI.Sprite.from('title_main_1');
            fune.anchor.x = 0.5;
            fune.anchor.y = 0.5;
            fune.x = GameParameters.Component.APP_WIDTH / 2;
            fune.y = GameParameters.Component.APP_HEIGHT / 2 - 40;
            stage.addChild(fune);
            Components.blackScreen = stage;
            Components.scene.addChild(Components.blackScreen);
        }
        function blackScreen() {
            if (Iterator.i == 320)
                createjs.Sound.play("title", { loop: -1, volume: GameParameters.Status.soundVolume["music"] * 5 });
            if (Iterator.i >= 360) {
                Create.Scene.Home(Components.scenesManager);
                Components.scenesManager.goToScene('home');
                return;
            }
            Components.blackScreen.children[2].y += Math.cos(Math.PI * Iterator.i / 32) * 1.1;
            Iterator.i += 1;
        }
        function createStartButton(scenesManager) {
            var stage = new PIXI.Container();
            var button = PIXI.Sprite.from("title_main_4");
            button.alpha = 0;
            var buttonMask = PIXI.Sprite.from("title_main_5");
            buttonMask.alpha = 0;
            button.addChild(buttonMask);
            button.on('mouseover', function () {
                this.children[0].alpha = 1;
            });
            button.on('mouseout', function () {
                this.children[0].alpha = 0;
            });
            button.on('pointerdown', function () {
                Components.scene.removeChild(Components.startButton);
                /***    本番はこのコメントアウトを外す   ***/
                createBlackScreen();
                Iterator.i = 0;
                Iterator.j = 1;
                Iterator.k = 100;
                //Create.Scene.Home(Components.scenesManager);
                //Components.scenesManager.goToScene('home');
            });
            stage.x = 337;
            stage.y = GameParameters.Component.APP_HEIGHT * 3 / 4 + 20;
            stage.addChild(button);
            Components.startButton = stage;
        }
    })(Scene = Create.Scene || (Create.Scene = {}));
})(Create || (Create = {}));

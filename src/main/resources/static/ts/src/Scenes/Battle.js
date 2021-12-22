///<reference path="../../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="../GameParameters.ts" />
///<reference path="../CreateComponent.ts" />
///<reference path="../Ajax.ts" />
///<reference path="Result.ts" />
///<reference path="../../lib/node_modules/@types/createjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/easeljs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/preloadjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/soundjs/index.d.ts" />
///<reference path="../../lib/node_modules/@types/tweenjs/index.d.ts" />
var Create;
(function (Create) {
    var Scene;
    (function (Scene) {
        function Battle(sceneManager) {
            Components.scenesManager = sceneManager;
            Components.scene = sceneManager.createScene('battle');
            Components.scene.onUpdate(Animation.animation);
            Components.faceIcons = Create.Component.faceIcons(sceneManager);
            var mapStage = createMap();
            Components.fleetIconsStage = createFleetIcons();
            Components.enemyIconsStage = createEnemyIcons();
            createMapMask();
            createButton();
            createExplosionAnimation(sceneManager);
            Components.cutin = Create.Component.battleCutin(sceneManager);
            for (var i = 0; i < 3; i++)
                Components.buttonStages[i] = createCmdButton(i);
            Components.fleetImages = Create.Component.fleetImages(sceneManager);
            Components.scene.addChild(createBackgrund());
            Components.scene.addChild(mapStage);
            Components.scene.addChild(Components.fleetIconsStage);
            Components.scene.addChild(Components.enemyIconsStage);
            GameParameters.Status.callAnimationId = 'battleStart';
            Components.scene.addChild(Components.explosionSpritesStage);
        }
        Scene.Battle = Battle;
        var Components = /** @class */ (function () {
            function Components() {
            }
            Components.map = new Array();
            Components.mapMask = new Array();
            Components.fleetIcons = new Array();
            Components.enemyIcons = new Array();
            Components.buttonStages = new Array();
            Components.faceIcons = new Array();
            Components.fleetImages = new Array();
            Components.explosionSprites = new Array();
            Components.explosionSpritesStages = new Array();
            return Components;
        }());
        function createBackgrund() {
            var background;
            var texture;
            Components.scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/battle.jpg');
                background = new PIXI.Sprite(texture);
            });
            return background;
        }
        // マップ
        function createMap() {
            var mapStage = new PIXI.Container();
            var map = Create.Component.map();
            for (var y = 0; y < 5; y++) {
                for (var x = 0; x < 5; x++) {
                    map[y][x].interactive = false;
                    map[y][x].on('pointerdown', mapAL);
                    mapStage.addChild(map[y][x]);
                }
            }
            for (var _i = 0, _a = GameParameters.Status.fleetPosition; _i < _a.length; _i++) {
                var obj = _a[_i];
                map[obj.position[0]][obj.position[1]].interactive = true;
                map[obj.position[0]][obj.position[1]].fleet = obj.id;
                map[obj.position[0]][obj.position[1]].alpha = 1;
                map[obj.position[0]][obj.position[1]].addChild(Components.faceIcons[obj.id]);
            }
            Components.map = map;
            return mapStage;
        }
        //マップマスク
        function createMapMask() {
            var mapMask = Create.Component.map();
            for (var y = 0; y < 5; y++) {
                for (var x = 0; x < 5; x++) {
                    mapMask[y][x].beginFill(0xffff00);
                    mapMask[y][x].drawRect(0, 0, GameParameters.Component.MAP_BIT_SIZE, GameParameters.Component.MAP_BIT_SIZE);
                    mapMask[y][x].endFill();
                    mapMask[y][x].on('pointerdown', mapMaskAL);
                }
            }
            Components.mapMask = mapMask;
            Components.mapMaskStage = new PIXI.Container();
        }
        // 艦隊アイコン
        function createFleetIcons() {
            var fleetIconsStage = new PIXI.Container();
            var fleetIcons = Create.Component.fleetIcons(Components.scenesManager);
            for (var i = 0; i < 9; i++) {
                if (i < 6)
                    fleetIcons[i].on('pointerdown', fleetIconsAL);
                if (i < 3) {
                    fleetIcons[i].alpha = 0;
                    fleetIcons[i].x = -240;
                    fleetIconsStage.addChild(GraphicControl.hpView(i));
                }
                else if (i < 6) {
                    fleetIcons[i].interactive = false;
                    fleetIcons[i].buttonMode = false;
                }
                fleetIconsStage.addChild(fleetIcons[i]);
            }
            Components.fleetIcons = fleetIcons;
            return fleetIconsStage;
        }
        // 敵アイコン
        function createEnemyIcons() {
            var enemyIconsStage = new PIXI.Container();
            var enemyIcons = Create.Component.enemyIcons(Components.scenesManager);
            for (var i = 0; i < 3; i++) {
                enemyIconsStage.addChild(enemyIcons[i * 2]);
                enemyIconsStage.addChild(enemyIcons[i * 2 + 1]);
            }
            Components.enemyIcons = enemyIcons;
            return enemyIconsStage;
        }
        // 決定ボタン
        function createButton() {
            var button = Create.Component.button();
            button.on('pointerdown', button3AL);
            Components.button = button;
        }
        // 攻撃/移動ボタン
        function createCmdButton(id) {
            var buttonStage = new PIXI.Container();
            var action1 = Create.Component.actionCmdButton("主砲: " + String(GameParameters.Status.fleet[id]["bullet"]), 0);
            action1.x = GameParameters.Component.ACTION_CMD_BUTTON_X;
            action1.y = GameParameters.Component.ACTION_CMD_BUTTON_Y;
            action1.children[0].on('pointerdown', buttonAL);
            var action2 = Create.Component.actionCmdButton("副砲: ∞", 0);
            action2.x = GameParameters.Component.ACTION_CMD_BUTTON_X;
            action2.y = GameParameters.Component.ACTION_CMD_BUTTON_Y + 80;
            var action3 = Create.Component.actionCmdButton("", 0);
            action3.x = GameParameters.Component.ACTION_CMD_BUTTON_X;
            action3.y = GameParameters.Component.ACTION_CMD_BUTTON_Y + 160;
            var move = Create.Component.actionCmdButton("移動", 1);
            move.x = GameParameters.Component.ACTION_CMD_BUTTON_X;
            move.y = GameParameters.Component.ACTION_CMD_BUTTON_Y + 240;
            move.children[0].on('pointerdown', button2AL);
            buttonStage.addChild(action1);
            buttonStage.addChild(action2);
            buttonStage.addChild(action3);
            buttonStage.addChild(move);
            return buttonStage;
        }
        function updateCmdButton(selectedId, buttonId) {
            var text = Components.buttonStages[selectedId].children[buttonId].children[1]._text.slice(0, -2);
            text += String(GameParameters.Status.fleet[selectedId]['bullet']) + " ";
            Components.buttonStages[selectedId].children[buttonId].removeChildAt(1);
            Components.buttonStages[selectedId].children[buttonId].addChild(Create.Component.text(text));
        }
        // 爆発アニメーション
        function createExplosionAnimation(scenesManager) {
            Components.explosionSpritesStage = new PIXI.Container();
            Components.explosionSprites = Create.Component.explosionAnimation(scenesManager);
            for (var i = 0; i < 3; i++) {
                Components.explosionSpritesStages[i] = new PIXI.Container();
                Components.explosionSpritesStage.addChild(Components.explosionSpritesStages[i]);
            }
            Components.explosionSpritesStages[1].x += 50;
            Components.explosionSpritesStages[1].y -= 50;
            Components.explosionSpritesStages[2].x -= 50;
            Components.explosionSpritesStages[2].y -= 40;
        }
        function resetParam() {
            var selectedId = GameParameters.Status.selectedFleetIcon['id'];
            var newPosition = GameParameters.Status.selectedMapMask;
            var oldPosition = GameParameters.Status.fleetPosition[selectedId]['position'];
            Components.map[oldPosition[0]][oldPosition[1]].fleet = '-1';
            Components.map[oldPosition[0]][oldPosition[1]].alpha = GameParameters.Component.DEFAULT_ALPHA;
            Components.map[oldPosition[0]][oldPosition[1]].interactive = false;
            Components.map[oldPosition[0]][oldPosition[1]].removeChild(Components.faceIcons[selectedId]);
            Components.map[newPosition[0]][newPosition[1]].fleet = selectedId;
            Components.map[newPosition[0]][newPosition[1]].alpha = 1;
            Components.map[newPosition[0]][newPosition[1]].interactive = true;
            Components.map[newPosition[0]][newPosition[1]].addChild(Components.faceIcons[selectedId]);
            GameParameters.Status.fleetPosition[selectedId]['position'] = newPosition;
            GameParameters.Status.selectedFleetIcon.id = -1;
        }
        /*** アクションリスナー ***/
        function fleetIconsAL() {
            GraphicControl.resetMapMask();
            GraphicControl.buttons(true);
            if (GameParameters.Status.selectedActionButton != "blank") {
                GraphicControl.removeMapMask();
                GraphicControl.addMapMask(this.id, GameParameters.Status.selectedActionButton);
            }
            if (GameParameters.Status.selectedFleetIcon.id != -1) {
                //Components.fleetIcons[GameParameters.Status.selectedFleetIcon.id].x = GameParameters.Component.FLEET_ICONS_X;
                Components.scene.removeChild(Components.fleetImages[GameParameters.Status.selectedFleetIcon.id]);
                Components.scene.removeChild(Components.buttonStages[GameParameters.Status.selectedFleetIcon.id]);
            }
            GameParameters.Status.selectedFleetIcon.id = this.id;
            //this.x += 20;
            Components.scene.addChildAt(Components.fleetImages[this.id], 2);
            Components.scene.addChild(Components.buttonStages[this.id]);
            //GraphicControl.buttons(true);
        }
        function mapAL() {
            var fleetId = this.fleet;
            Components.fleetIcons[fleetId].emit('pointerdown');
        }
        function mapMaskAL() {
            GraphicControl.resetMapMask();
            Components.scene.addChild(Components.button);
            GameParameters.Status.selectedMapMask = this.position_;
            this.alpha = 1;
        }
        function buttonAL() {
            if (GameParameters.Status.selectedFleetIcon['id'] == -1) {
                console.log("艦を選択してください");
                return;
            }
            if (GameParameters.Status.fleet[GameParameters.Status.selectedFleetIcon['id']]['bullet'] <= 0) {
                console.log("残弾がありません");
                return;
            }
            GameParameters.Status.selectedActionButton = 'attack';
            GraphicControl.resetMapMask();
            GraphicControl.addMapMask(GameParameters.Status.selectedFleetIcon['id'], 'attack');
            /***
            var area = Ajax.get('api_action_possible_area')
            var json = JSON.parse(area)
            GameParameters.Status.actionPossibleArea = json;
            console.log(GameParameters.Status.actionPossibleArea);***/
        }
        function button2AL() {
            if (GameParameters.Status.selectedFleetIcon['id'] == -1) {
                console.log("艦を選択してください");
                return;
            }
            GameParameters.Status.selectedActionButton = 'move';
            GraphicControl.resetMapMask();
            GraphicControl.addMapMask(GameParameters.Status.selectedFleetIcon['id'], 'move');
        }
        function button3AL() {
            if (GameParameters.Status.selectedMapMask[0] == -1) {
                console.log("アクションコード送信エラー");
                return;
            }
            var newPosition = GameParameters.Status.selectedMapMask;
            var selectedId = GameParameters.Status.selectedFleetIcon['id'];
            var url;
            if (GameParameters.Status.selectedActionButton == 'attack') {
                GameParameters.Status.fleet[selectedId]['bullet'] -= 1;
                updateCmdButton(selectedId, 0);
                url = 'api_attack';
            }
            else if (GameParameters.Status.selectedActionButton == 'move')
                url = 'api_move';
            else
                return;
            Components.scene.removeChild(Components.fleetImages[GameParameters.Status.selectedFleetIcon.id]);
            Components.scene.removeChild(Components.buttonStages[GameParameters.Status.selectedFleetIcon.id]);
            Components.scene.removeChild(Components.button);
            var enemyActionState;
            var area;
            var result;
            $.when(Ajax.post(url, [{ id: selectedId, position: newPosition }])
                .done(function (json) {
                GameParameters.Status.attackStatement = json;
                console.log("- your action -");
                console.log(json);
                if (GameParameters.Status.selectedActionButton == 'move') {
                    resetParam();
                    GraphicControl.removeMapMask();
                }
                GraphicControl.sceneReset();
                GameParameters.Status.selectedActionButton = 'blank';
                if (GameParameters.Status.attackStatement['game_end'])
                    GameParameters.Status.enemyActionState['action'] == 'none';
                if (!GameParameters.Status.attackStatement['game_end']) {
                    $.ajax({
                        url: 'api_cpu_action',
                        async: true,
                        type: 'GET',
                        dataType: "json"
                    })
                        .done(function (data) {
                        GameParameters.Status.enemyActionState = data;
                        console.log("- enemy action -");
                        console.log(data);
                        $.ajax({
                            url: 'api_action_possible_area',
                            async: true,
                            type: 'GET',
                            dataType: "json"
                        })
                            .done(function (data) {
                            GameParameters.Status.actionPossibleArea = data;
                            //Animation.animationProgress();
                            $.ajax({
                                url: 'api_enemy_data',
                                async: true,
                                type: 'GET',
                                dataType: "json"
                            })
                                .done(function (data) {
                                console.log(data);
                                Animation.animationProgress();
                            });
                        });
                    });
                }
                else
                    Animation.animationProgress();
            }));
        }
        /***   ダメージ処理   ***/
        function damageProcessing(statement) {
            if (statement['hit'] == -1)
                return;
            if (statement['destroy']) {
                Components.fleetIcons[statement['hit']].alpha = 0;
                Components.fleetIcons[statement['hit'] + 3].alpha = 0;
                Components.fleetIcons[statement['hit'] + 6].alpha = 1;
                GameParameters.Status.fleet[statement['hit']]['hp'] = 0;
                var position = GameParameters.Status.fleetPosition[statement['hit']]['position'];
                Components.map[position[0]][position[1]].alpha = GameParameters.Component.DEFAULT_ALPHA;
                Components.map[position[0]][position[1]].interactive = false;
                Components.fleetIcons[statement['hit']].interactive = false;
                Components.fleetIcons[statement['hit']].buttonMode = false;
            }
            else if (statement['hit'] >= 0) {
                GameParameters.Status.fleet[statement['hit']]['hp'] -= 1;
                if (GameParameters.Status.fleet[statement['hit']]['hp'] < GameParameters.Status.fleet[statement['hit']]['maxhp'] / 3) {
                    Components.fleetIcons[statement['hit']].alpha = 0;
                    Components.fleetIcons[statement['hit'] + 3].alpha = 1;
                }
            }
            if (statement['hit'] >= 0) {
                Components.fleetIconsStage.removeChildAt(statement['hit'] * 2);
                Components.fleetIconsStage.addChildAt(GraphicControl.hpView(statement['hit']), statement['hit'] * 2);
            }
        }
        Scene.damageProcessing = damageProcessing;
        function hitProcessing(statement) {
            if (statement['hit'] == -1)
                return;
            if (statement['destroy']) {
                Components.enemyIcons[statement['hit'] * 2].alpha = 0;
                Components.enemyIcons[statement['hit'] * 2 + 1].alpha = 1;
            }
        }
        Scene.hitProcessing = hitProcessing;
        /*** グラフィック制御関数 ***/
        var GraphicControl;
        (function (GraphicControl) {
            var Activation = /** @class */ (function () {
                function Activation() {
                }
                Activation.button = false;
                return Activation;
            }());
            function buttons(activation) {
                if (Activation.button && !activation) {
                    //Components.scene.removeChild(Components.buttonStage);
                    Activation.button = false;
                }
                else if (!Activation.button && activation) {
                    //Components.scene.addChild(Components.buttonStage);
                    Activation.button = true;
                }
                else {
                    return;
                }
            }
            GraphicControl.buttons = buttons;
            function addMapMask(fleetId, action) {
                var area;
                if (action == "attack") {
                    area = GameParameters.Status.actionPossibleArea[action][fleetId]['positions'];
                }
                else if (action == "move") {
                    area = GameParameters.Status.actionPossibleArea[action][fleetId]['positions'];
                }
                else {
                    console.log("不明なアクションコード\"", action, "\"");
                    return;
                }
                GraphicControl.removeMapMask();
                if (!area)
                    return;
                for (var _i = 0, area_1 = area; _i < area_1.length; _i++) {
                    var position = area_1[_i];
                    Components.mapMaskStage.addChild(Components.mapMask[position[0]][position[1]]);
                }
                Components.scene.addChild(Components.mapMaskStage);
            }
            GraphicControl.addMapMask = addMapMask;
            function removeMapMask() {
                Components.scene.removeChild(Components.button);
                Components.scene.removeChild(Components.mapMaskStage);
                Components.mapMaskStage = new PIXI.Container();
            }
            GraphicControl.removeMapMask = removeMapMask;
            function resetMapMask() {
                var old_position = GameParameters.Status.selectedMapMask;
                if (old_position[0] != -1) {
                    Components.mapMask[old_position[0]][old_position[1]].alpha = GameParameters.Component.DEFAULT_ALPHA;
                    GameParameters.Status.selectedMapMask = [-1, -1];
                    //Components.scene.removeChild(Components.button);
                }
            }
            GraphicControl.resetMapMask = resetMapMask;
            function sceneReset() {
                Components.scene.removeChild(Components.button);
                resetMapMask();
                removeMapMask();
                buttons(false);
            }
            GraphicControl.sceneReset = sceneReset;
            function hpView(id) {
                var style = new PIXI.TextStyle({
                    fontSize: 26,
                    fill: 0x000000,
                    fontFamily: "Verdana, Geneva, sans-serif",
                    fontStyle: "italic"
                });
                var text = new PIXI.Text(GameParameters.Status.fleet[id]["hp"] + "/" + GameParameters.Status.fleet[id]["maxHp"] + " ", style);
                text.anchor.y = 0.5;
                text.x = GameParameters.Component.FLEET_ICONS_X + 260;
                text.y = GameParameters.Component.FLEET_ICONS_Y + 30 + id * 80;
                return text;
            }
            GraphicControl.hpView = hpView;
        })(GraphicControl || (GraphicControl = {}));
        /*** アニメーション ***/
        var Animation;
        (function (Animation) {
            var Iterator = /** @class */ (function () {
                function Iterator() {
                }
                Iterator.i = 0;
                Iterator.j = 0;
                Iterator.phase = 0;
                return Iterator;
            }());
            var AnimeState = /** @class */ (function () {
                function AnimeState() {
                }
                AnimeState.playerAction = false;
                AnimeState.enemyAction = false;
                return AnimeState;
            }());
            function battleStart() {
                if (Iterator.i == 30) {
                    createjs.Sound.play("battle", { loop: -1, volume: GameParameters.Status.soundVolume["music"] * 10 });
                    GameParameters.Status.callAnimationId = 'explosion';
                }
                else if (Iterator.i > 30)
                    return;
                if (Iterator.i == 8 || Iterator.i == 12 || Iterator.i == 16)
                    createjs.Sound.play("shu", { volume: GameParameters.Status.soundVolume["se"] });
                if (Iterator.i < 18 && Iterator.i >= 8) {
                    Components.fleetIcons[2].x += (GameParameters.Component.FLEET_ICONS_X + 240) / 10;
                    Components.fleetIcons[2].alpha += 0.1;
                    Components.enemyIcons[4].x -= 27;
                    Components.enemyIcons[4].alpha += 0.1;
                }
                if (Iterator.i < 14 && Iterator.i >= 4) {
                    Components.fleetIcons[1].x += (GameParameters.Component.FLEET_ICONS_X + 240) / 10;
                    Components.fleetIcons[1].alpha += 0.1;
                    Components.enemyIcons[2].x -= 27;
                    Components.enemyIcons[2].alpha += 0.1;
                }
                if (Iterator.i < 10) {
                    Components.fleetIcons[0].x += (GameParameters.Component.FLEET_ICONS_X + 240) / 10;
                    Components.fleetIcons[0].alpha += 0.1;
                    Components.enemyIcons[0].x -= 27;
                    Components.enemyIcons[0].alpha += 0.1;
                }
                Iterator.i += 1;
                //Components.enemyIconsStage
            }
            Animation.battleStart = battleStart;
            function animation() {
                if (GameParameters.Status.callAnimationId == 'battleStart')
                    battleStart();
                else
                    Animation.explosion();
            }
            Animation.animation = animation;
            function explosion() {
                if (GameParameters.Status.callAnimationId != 'explosion')
                    return;
                Components.explosionSpritesStages[0].removeChild(Components.explosionSprites[Iterator.i - 1]);
                if (Iterator.i == 0)
                    createjs.Sound.play("explosion1", { volume: 0.2 });
                if (Iterator.i >= 17) {
                    GameParameters.Status.callAnimationId = 'none';
                    Iterator.i = 0;
                    Iterator.j = 0;
                    Iterator.phase += 1;
                    if (GameParameters.Status.attackStatement['game_end'])
                        Iterator.phase = 2;
                    if (AnimeState.enemyAction && GameParameters.Status.enemyActionState['action'] == 'attack')
                        damageProcessing(GameParameters.Status.enemyActionState);
                    if (AnimeState.playerAction && GameParameters.Status.attackStatement['action'] == 'attack')
                        hitProcessing(GameParameters.Status.attackStatement);
                    animationProgress();
                    return;
                }
                Components.explosionSpritesStages[0].addChild(Components.explosionSprites[Iterator.i]);
                Iterator.j += 1;
                if (Iterator.j % 2 == 0)
                    Iterator.i += 1;
            }
            Animation.explosion = explosion;
            function doExplosion(position) {
                GameParameters.Status.callAnimationId = 'explosion';
                Components.explosionSpritesStages[0].x = 440 + position[1] * 80;
                Components.explosionSpritesStages[0].y = 190 + position[0] * 80;
            }
            Animation.doExplosion = doExplosion;
            function gameend() {
                if (GameParameters.Status.callAnimationId != 'gameend')
                    return;
                if (Iterator.i == 0)
                    createjs.Sound.stop();
                else if (Iterator.i > 20) {
                    GameParameters.Status.callAnimationId = 'none';
                    Iterator.phase = 0;
                    $.ajax({
                        url: 'api_result',
                        async: true,
                        type: 'GET',
                        dataType: "json"
                    })
                        .done(function (data) {
                        GameParameters.Status.result = data;
                        console.log(GameParameters.Status.result);
                        Components.scenesManager.goToScene('result');
                        return;
                    });
                }
                Iterator.i += 1;
            }
            Animation.gameend = gameend;
            function animationProgress() {
                if (Iterator.phase == 0) {
                    if (GameParameters.Status.precedence == 0 && GameParameters.Status.attackStatement['action'] == 'attack') {
                        AnimeState.playerAction = true;
                        doExplosion(GameParameters.Status.attackStatement['position']);
                    }
                    else if (GameParameters.Status.precedence == 1 && GameParameters.Status.enemyActionState['action'] == 'attack') {
                        AnimeState.enemyAction = true;
                        doExplosion(GameParameters.Status.enemyActionState['position']);
                    }
                    else {
                        Iterator.phase = 1;
                        animationProgress();
                        return;
                    }
                }
                else if (Iterator.phase == 1) {
                    if (GameParameters.Status.precedence == 1 && GameParameters.Status.attackStatement['action'] == 'attack') {
                        AnimeState.playerAction = true;
                        doExplosion(GameParameters.Status.attackStatement['position']);
                    }
                    else if (GameParameters.Status.precedence == 0 && GameParameters.Status.enemyActionState['action'] == 'attack') {
                        AnimeState.enemyAction = true;
                        doExplosion(GameParameters.Status.enemyActionState['position']);
                    }
                    else {
                        Iterator.phase = 2;
                        animationProgress();
                        return;
                    }
                }
                else if (Iterator.phase == 2) {
                    if (GameParameters.Status.attackStatement['game_end'] || GameParameters.Status.enemyActionState['game_end']) {
                        GameParameters.Status.callAnimationId = 'gameend';
                        Components.scene.onUpdate(gameend);
                    }
                    else {
                        Iterator.phase = 0;
                        return;
                    }
                }
            }
            Animation.animationProgress = animationProgress;
        })(Animation || (Animation = {}));
    })(Scene = Create.Scene || (Create.Scene = {}));
})(Create || (Create = {}));

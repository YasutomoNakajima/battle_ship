///<reference path="../lib/node_modules/pixi.js/pixi.js.d.ts" />
///<reference path="GameParameters.ts" />

module Create.Component{

    export function gameStartButton() {
        var sprites: any = new Array();
        for (var i=0; i<8; i++){
            var name = "title_main_"+String(i);
            sprites.push(PIXI.Sprite.from(name));
            sprites[i].x = i*100;
        }
        return sprites
    }

    export function button() {
        var button: any;
        button = new PIXI.Graphics();

        button.beginFill(0x000000);
        button.drawPolygon(
            0, 40,
            32, 0,
            280, 0,
            312, 40,
            280, 80,
            32, 80
        );
        button.endFill();
        button.alpha = 0.6;
        button.interactive = true;
        button.buttonMode = true;
        //button.anchor.x = 0.5;
        //button.anchor.y = 0.5;
        button.x = GameParameters.Component.APP_WIDTH/2-156;
        button.y = (3 * GameParameters.Component.APP_HEIGHT + (GameParameters.Component.MAP_BIT_SIZE+2)*5)/4-40;
        return button;
    }

    export function actionCmdButton(text: string, type: number) {
        var buttonStage = new PIXI.Container();
        var button: any;
        button = new PIXI.Graphics();
        if(type==0) button.beginFill(0xFE4F4F);
        else if(type==1) button.beginFill(0x03EF75);
        else button.beginFill(0x000000);
        button.drawPolygon([
            80, 0,
            300, 0,
            220, 64,
            0, 64
        ]);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        button.alpha = GameParameters.Component.DEFAULT_ALPHA;

        var textSprite = Create.Component.text(" "+text+" ");
        buttonStage.addChild(button);
        buttonStage.addChild(textSprite);
        return buttonStage;
    }

    export function text(text: string) {
        var style = new PIXI.TextStyle({
            fontSize: 32,
            fontWeight: "bold",
            fill: 0x000000,
            fontFamily: "Georgia, serif",
            fontStyle: "italic"
        });
        var textSprite = new PIXI.Text(text, style);
        textSprite.anchor.x = 0.5;
        textSprite.anchor.y = 0.5;
        textSprite.x = 150;
        textSprite.y = 32;
        return textSprite;
    }

    export function map() {
        var map: any[][] = new Array();
        for(var y=0; y<5; y++){
            map[y] = new Array();
            for(var x=0; x<5; x++){
                map[y][x] = new PIXI.Graphics();
                map[y][x].position_ = [y, x];
                map[y][x].x = x * (GameParameters.Component.MAP_BIT_SIZE + 2) + GameParameters.Component.APP_WIDTH/2-200;
                map[y][x].y = y * (GameParameters.Component.MAP_BIT_SIZE + 2) + GameParameters.Component.APP_HEIGHT/2-200;
                map[y][x].beginFill(0x0000cd);
                map[y][x].drawRect(0,0,GameParameters.Component.MAP_BIT_SIZE,GameParameters.Component.MAP_BIT_SIZE);
                map[y][x].endFill();
                map[y][x].interactive = true;
                map[y][x].buttonMode = true;
                map[y][x].alpha = GameParameters.Component.DEFAULT_ALPHA;
                map[y][x].fleet = -1;
            }
        }return map;
    }

    export function fleetIcons(scenesManager){
        var fleetIcons: any = new Array();
        var texture: any;
        for(var i=0; i<9; i++){
            fleetIcons[i] =  new PIXI.Container();
            scenesManager.loader.load(function () {
                if(i<3) texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.team[i]+'_b.png');
                else if(i<6) texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.team[i%3]+'_c.png');
                else texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.team[i%3]+'_d.png');
                fleetIcons[i].addChild(new PIXI.Sprite(texture));
                if(i>=6)fleetIcons[i].addChild(gekitinIcon(scenesManager));
            });
            fleetIcons[i].id = i%3;
            fleetIcons[i].hp = 3-i;
            fleetIcons[i].bullet_num = (4-i)*(4-i)-(3-i)*3;
            fleetIcons[i].x = GameParameters.Component.FLEET_ICONS_X;
            fleetIcons[i].y = i%3 *80 +GameParameters.Component.FLEET_ICONS_Y;
            fleetIcons[i].alpha = 0;
            if(i<3)fleetIcons[i].alpha = GameParameters.Component.DEFAULT_ALPHA;
            if(i<6){
                fleetIcons[i].interactive = true;
                fleetIcons[i].buttonMode = true;
            }
            fleetIcons[i].select = false;
            fleetIcons[i].putPos = [-1, -1]; // [y, x]
        }return fleetIcons;
    }

    export function  enemyIcons(scenesManager) {
        var enemyIcons: any = new Array();
        var texture: any;

        for(var i=0; i<3; i++){
            enemyIcons[i*2] = new PIXI.Container();
            enemyIcons[i*2+1] = new PIXI.Container();
            scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.enemyTeam[i]+'_b.png');
                enemyIcons[i*2].addChild(new PIXI.Sprite(texture));
                texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.enemyTeam[i]+'_c.png');
                enemyIcons[i*2+1].addChild(new PIXI.Sprite(texture));
                enemyIcons[i*2+1].addChild(gekitinIcon(scenesManager));
            });
            enemyIcons[i*2].id = i;
            enemyIcons[i*2].x = GameParameters.Component.APP_WIDTH;
            //enemyIcons[i*2].x = 0;
            enemyIcons[i*2].y = i *80+GameParameters.Component.APP_HEIGHT-290;
            enemyIcons[i*2+1].id = i;
            enemyIcons[i*2+1].alpha = 0;
            enemyIcons[i*2+1].x = GameParameters.Component.APP_WIDTH-270;
            enemyIcons[i*2+1].y = i *80+GameParameters.Component.APP_HEIGHT-290;
        }return enemyIcons;
    }

    export function gekitinIcon(scenesManager) {
        var texture2: any;
        scenesManager.loader.load(function () {
            texture2 = PIXI.Texture.from('/images/char/gekitin.png');
        });
        var sprite = new PIXI.Sprite(texture2);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.x = 0.17;
        sprite.scale.y = 0.17;
        sprite.y = 34;
        sprite.x = 210;

        return sprite;
    }

    export function faceIcons(scenesManager) {
        var faceIcons: any = new Array();
        var texture: any;
        for(var i=0; i<3; i++){
            faceIcons[i] = new PIXI.Container();
            texture = scenesManager.loader.load(function () {
                texture = new PIXI.Texture(PIXI.BaseTexture.from('/images/char/'+GameParameters.Status.team[i]+'_b.png'), new PIXI.Rectangle(110, 0, 60, 60));
                //texture = PIXI.Texture.from('/images/char/'+GameParameters.Status.team[i]+'_b.png');
                var sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5);
                sprite.scale.x = 1.3;
                sprite.scale.y = 1.3;
                sprite.x = 39;
                sprite.y = 39;
                faceIcons[i].addChild(sprite);
            });
            faceIcons[i].id = i;
            //faceIcons[i].x = i*70;
            //faceIcons[i].y = 0;
        }return faceIcons;
    }

    export function fleetImages(scenesManager) {
        var fleetImages: any = new Array();
        var texture: any;
        for(var i=0; i<3; i++) {
            fleetImages[i] = new PIXI.Container();
            texture = scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/char/' + GameParameters.Status.team[i] + '_big.png');
                var sprite = new PIXI.Sprite(texture);
                sprite.x = GameParameters.Component.APP_WIDTH*2/3+50;
                sprite.y = 0;
                sprite.scale.x = 0.65;
                sprite.scale.y = 0.65;
                fleetImages[i].addChild(sprite);
            });
            fleetImages[i].id = i;
        }return fleetImages;
    }

    export function explosionAnimation(scenesManager){
        var sprites: any[] = new Array();

        for(var i=0; i<17; i++){
            var name = String(i)+".png";
            sprites.push(PIXI.Sprite.from(name));
            sprites[i].anchor.x = 0.5;
            sprites[i].anchor.y = 0.5;
            //sprites[i].x = 800;
            //sprites[i].y = 600; sally_sortie_
        }
        return sprites;
    }

    export function battleStart(scenesManager) {
        var texture;
        texture = scenesManager.loader.load(function () {
            texture = PIXI.Texture.from('/images/message/battle_start.png');
        });
        var sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.x = GameParameters.Component.APP_WIDTH / 2;
        sprite.y = GameParameters.Component.APP_HEIGHT / 2;
        sprite.alpha = 0;
        return sprite;
    }

    export function titleText(text: string) {
        var style = new PIXI.TextStyle({
            fontSize: 32,
            fontWeight: "bold",
            fill: 0xffffff,
            strokeThickness: 3,
        });
        var textSprite = new PIXI.Text(text, style);
        textSprite.anchor.x = 0.5;
        textSprite.anchor.y = 0.5;
        textSprite.x = GameParameters.Component.APP_WIDTH/2;
        textSprite.y = GameParameters.Component.APP_HEIGHT/2+80;
        return textSprite;
    }

    export function informationHeader(text: string) {
        var style = new PIXI.TextStyle({
            fontSize: 32,
            fontWeight: "bold",
            fill: 0xffffff,
            fontFamily: "Georgia, serif",
        });
        var textSprite = new PIXI.Text(text, style);
        textSprite.x = 20;
        textSprite.y = 20;
        return textSprite;
    }

    export function informationText(text: string) {
        var style = new PIXI.TextStyle({
            fontSize: 24,
            fill: 0xffffff,
            fontFamily: "Georgia, serif",
        });
        var textSprite = new PIXI.Text(text, style);
        textSprite.x = 60;
        textSprite.y = 80;
        return textSprite;
    }

    export function informationPanel(scenesManager) {
        var stage = new PIXI.Container();
        var roundBox = new PIXI.Graphics();
        roundBox.lineStyle(4, 0xffd700, 1);
        roundBox.beginFill(0x1a1a1a, 0.85);

        // drawRoundedRect(x, y, width, height, cornerRadius)
        roundBox.drawRoundedRect(0, 0, 800, 600, 8);
        roundBox.endFill();
        stage.addChild(roundBox);

        var icon = closeIcon(scenesManager);
        icon.x = 771;
        icon.y = -14;
        stage.addChild(icon);

        // 位置（四角の左上が基準として）
        stage.x = GameParameters.Component.APP_WIDTH/2-400;
        stage.y = GameParameters.Component.APP_HEIGHT/2-300;

        return stage;
    }

    export function closeIcon(scenesManager) {
        var roundBox = new PIXI.Graphics();
        roundBox.lineStyle(3, 0xffd700, 1);
        roundBox.beginFill(0xb33636);
        roundBox.drawRect(0, 0, 46, 46);
        roundBox.endFill();

        // 直線を描く
        var line = new PIXI.Graphics();
        line.lineStyle(4, 0xffffff, 1);
        line.moveTo(0, 0);
        line.lineTo(30, 30);
        line.x = 8;
        line.y = 8;

        var line2 = new PIXI.Graphics();
        line.lineStyle(4, 0xffffff, 1);
        line.moveTo(30, 0);
        line.lineTo(0, 30);
        line2.x = 8;
        line2.y = 8;

        roundBox.addChild(line);
        roundBox.addChild(line2);

        roundBox.interactive = true;
        roundBox.buttonMode = true;

        return roundBox;
    }
    
    export function scoreText(logs) {
        var text = "";
        for(var i=0; i<logs.length; i++){
            text += "vs CPU: "+logs[i]["turn"]+"ターン ";
            if(logs[i]["winner"]==0)text += "勝ち";
            else if(logs[i]["winner"]==1)text += "負け ";
            logs[i]["time"] = logs[i]["time"].replace("-","/");
            logs[i]["time"] = logs[i]["time"].replace("-","/");
            logs[i]["time"] = logs[i]["time"].replace(/[a-zA-Z]/," ");
            logs[i]["time"] = logs[i]["time"].slice( 0, 19-logs[i]["time"].length );
            text += " - "+logs[i]["time"]+"\n"
        }
        return informationText(text);
    }

    export function stagePanel(scenesManager){
        var stageStage = new PIXI.Container();
        var height = 600;
        var width = 1000;

        var stage = new PIXI.Graphics();
        stage.beginFill(0x2529A2);
        stage.drawRect(0, 0, width, height);
        stage.endFill();
        stage.alpha = 0.8;
        stageStage.addChild(stage);

        var sprite: any[] = new Array();
        scenesManager.loader.load(function () {
            for(var i=0; i<4; i++) {
                var texture = PIXI.Texture.from('/images/stages/0' + String(i+1) + '.png');
                sprite[i] = new PIXI.Sprite(texture);
                sprite[i].buttonMode = true;
                sprite[i].interactive = true;
                sprite[i].id = i+1;
                var mask = PIXI.Sprite.from("sally_sortie_37");
                mask.alpha = 0;
                sprite[i].addChild(mask);
                stageStage.addChild(sprite[i]);
            }
        });
        sprite[0].x = 16;
        sprite[0].y = 100;
        sprite[1].x = 508;
        sprite[1].y = 100;
        sprite[2].x = 16;
        sprite[2].y = 320;
        sprite[3].x = 508;
        sprite[3].y = 320;

        var header = informationHeader("出撃する海域を選択してください");
        stageStage.addChild(header);

        stageStage.x = (GameParameters.Component.APP_WIDTH-width)/2+40;
        stageStage.y = (GameParameters.Component.APP_HEIGHT-height)/2+40;

        return stageStage;
    }

    export function stagePanel2(scenesManager) {
        var stageStage = new PIXI.Container();
        var stage = new PIXI.Graphics();
        stage.lineStyle(2, 0xffd700, 1);
        stage.beginFill(0xEDEED7);
        stage.drawPolygon([
            400, 0,
            60, 0,
            0, 60,
            0, 540,
            60, 600,
            400, 600
        ]);
        stage.endFill();
        stageStage.addChild(stage);
        return stageStage;
    }

    export function sallySorties() {
        var sprites: any = new Array();
        for (var i=0; i<45; i++){
            var name = "sally_sortie_"+String(i);
            sprites.push(PIXI.Sprite.from(name));
            //sprites[i].anchor.x = 0.5;
            //sprites[i].anchor.y = 0.5;
            //sprites[i].x = 30 + i*28;
            //sprites[i].y = 100;
        }// 14 戻る
        // 17 出撃開始赤 細　18　黒　19　オレンジ
        // 20 出撃開始でか赤 21 黒　22　オレンジ
        // 23 勲章
        return sprites
    }//sally_common_

    export function backButton() {
        var sprite = PIXI.Sprite.from("sally_sortie_14");
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.interactive = true;
        sprite.buttonMode = true;
        return sprite;
    }

    export function sallyCommon() {
        var sprites: any = new Array();
        for (var i=0; i<69; i++){
            var name = "sally_common_"+String(i);
            sprites.push(PIXI.Sprite.from(name));
            sprites[i].x = i*30;
        }// 14 戻る
        // 17 出撃開始赤 細　18　黒　19　オレンジ
        // 20 出撃開始でか赤 21 黒　22　オレンジ
        // 23 勲章
        return sprites
    }
    
    export function decisionButton() {
        var sprite = PIXI.Sprite.from("sally_common_18");
        var spriteMask = PIXI.Sprite.from("sally_common_20");
        spriteMask.alpha = 0;
        sprite.addChild(spriteMask);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('mouseover',function () {
            this.children[0].alpha = 1;
        });
        sprite.on('mouseout',function () {
            this.children[0].alpha = 0;
        });
        return sprite;
    }

    export function shutugekiButton() {
        var sprite = PIXI.Sprite.from("sally_sortie_20");
        var spriteMask = PIXI.Sprite.from("sally_sortie_22");
        spriteMask.alpha = 0;
        sprite.addChild(spriteMask);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('mouseover',function () {
            this.children[0].alpha = 1;
        });
        sprite.on('mouseout',function () {
            this.children[0].alpha = 0;
        });
        return sprite;
    }

    export function sallyMapParts() {
        var sprites: any = new Array();
        for (var i=0; i<19; i++){
            var name = "sally_map_parts_"+String(i);
            sprites.push(PIXI.Sprite.from(name));
            sprites[i].x = i*30;
        }// 14 戻る
        // 17 出撃開始赤 細　18　黒　19　オレンジ
        // 20 出撃開始でか赤 21 黒　22　オレンジ
        // 23 勲章
        return sprites
    }

    export function textField() {
        var stage = new PIXI.Container();
        var sprite = PIXI.Sprite.from("sally_map_parts_18");
        //sprite.y = GameParameters.Component.APP_HEIGHT-140;
        stage.addChild(sprite);

        var sprite2 = PIXI.Sprite.from("sally_map_parts_15");
        sprite2.anchor.x = 0.5;
        sprite2.anchor.y = 0.5;
        sprite2.x = +50;
        sprite2.y = 90;

        var sprite4 = PIXI.Sprite.from("sally_map_parts_16");
        sprite4.anchor.x = 0.5;
        sprite4.anchor.y = 0.5;

        var sprite3 = PIXI.Sprite.from("sally_map_parts_17");
        sprite3.anchor.x = 0.5;
        sprite3.anchor.y = 0.5;
        //sprite3.x = 228;
        //sprite3.y = 228;
        sprite2.addChild(sprite3);
        sprite2.addChild(sprite4);
        sprite2.rotation = 0.875;
        stage.addChild(sprite2);

        return stage;
    }

    export function loadBar() {
        var stage = new PIXI.Container();

        var bar = new PIXI.Graphics();
        //frame.lineStyle(3, 0xffffff, 1);
        bar.beginFill(0x00CC99);
        bar.drawRect(0, 0, 1000, 30);
        bar.endFill();

        var frame = new PIXI.Graphics();
        frame.lineStyle(3, 0xffffff, 1);
        frame.beginFill(0x000000, 0);
        frame.drawRect(0, 0, 1000, 30);
        frame.endFill();

        stage.addChild(bar);
        stage.addChild(frame);

        stage.x = 100;
        stage.y = GameParameters.Component.APP_HEIGHT - 60;

        return stage;
    }
    
    export function fleetGigImage(scenesManager) {
        var fleetImages: any = new Array();
        var texture: any;
        for(var i=0; i<3; i++) {
            fleetImages[i] = new PIXI.Container();
            texture = scenesManager.loader.load(function () {
                texture = PIXI.Texture.from('/images/char/' + GameParameters.Status.team[i] + '.png');
                var sprite = new PIXI.Sprite(texture);
                sprite.scale.x = 0.76;
                sprite.scale.y = 0.76;
                //sprite.anchor.x = 0.5;
                //sprite.anchor.y = 0.5;
                fleetImages[i].addChild(sprite);
            });
            fleetImages[i].id = i;
        }return fleetImages;
    }

    export function mapCommon() {
        var sprites: any = new Array();
        for (var i=0; i<188; i++){
            var name = "map_common_"+String(i);
            sprites.push(PIXI.Sprite.from(name));
            //sprites[i].x = i*30;
        }// 112 赤フレーム 114 "戦闘海域に突入"
        return sprites
    }

    export function standbyMessage() {
        var stage = new PIXI.Container();
        var base = PIXI.Sprite.from("map_common_112");
        //base.anchor.x = 0.5;
        //base.anchor.y = 0.5;
        var text = PIXI.Sprite.from("map_common_114");
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.x = 900;
        text.y = 113;
        base.addChild(text);
        stage.addChild(base);
        return stage;
    }

    export function standbyMessage2(scenesManager) {
        var sprite: any;
        scenesManager.loader.load(function () {
            var texture = PIXI.Texture.from('/images/message/battle_start.png');
            sprite = new PIXI.Sprite(texture);
            sprite.alpha = 0;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.x = GameParameters.Component.APP_WIDTH/2;
            sprite.y = GameParameters.Component.APP_HEIGHT/2;
        });
        return sprite;
    }

    export function battleCutin(scenesManager) {
        var sprite: any;
        scenesManager.loader.load(function () {
            var texture = PIXI.Texture.from('/images/mes_f_hbg.png');
            sprite = new PIXI.Sprite(texture);
            //sprite.anchor.x = 0.5;
            //sprite.anchor.y = 0.5;
            sprite.x = -1200;
            sprite.y = GameParameters.Component.APP_HEIGHT;
        });
        return sprite;
    }
}
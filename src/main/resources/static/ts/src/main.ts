///<reference path="ScenesManager.ts" />
///<reference path="Scenes/Title.ts" />
///<reference path="Scenes/Home.ts" />
///<reference path="Scenes/StandBy.ts" />
///<reference path="Scenes/Battle.ts" />
///<reference path="Scenes/Result.ts" />
///<reference path="../lib/node_modules/pixi.js/pixi.js.d.ts" />


//get reference of ScenesManager;
var scenesManager = tuto.Ezelia.ScenesManager;

//create
scenesManager.create(1200, 720);


//create a the game scene
var game = scenesManager.createScene('game');

//add a bunny :)
var texture = PIXI.Texture.from("images/091.png");
var bunny = new PIXI.Sprite(texture);
// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;
// move the sprite t the center of the screen
bunny.position.x = 50;
bunny.position.y = 50;
game.addChild(bunny);
//register update event
var i = 0;
game.onUpdate(function () {
    bunny.rotation += 0.1;
    console.log("game scene");
    if(i>2){
        return;
    }
    i += 0.1;
});


Create.Scene.Title(scenesManager);
//Create.Scene.Home(scenesManager);
//Create.Scene.StandBy(scenesManager);
//Create.Scene.Battle(scenesManager);
Create.Scene.Result(scenesManager);
scenesManager.loader = PIXI.loader;

//switch to 'game' Scene
scenesManager.goToScene('title');

var width = 1440;    // 描画エリアのサイズ
var height = 810;
var params = {
    backgroundColor: 0xa0a0a0   // 背景色の指定（灰色）
};
var renderer = PIXI.autoDetectRenderer(width, height, params);  // レンダラー生成

// DOM操作にjQueryを使用するので事前に読み込んでおくこと
$("body").append(renderer.view);    // DOMにレンダラーのビューを追加

var stage = new PIXI.Container();   // ステージを生成
renderer.render(stage);     // レンダラーにステージを描画させる

PIXI.loader
    .add("/images/091.png")
    .load(setup);
// 画像からスプライトオブジェクトを作る
var texture = PIXI.Texture.fromImage('/091.png');
var logoimg = new PIXI.Sprite(texture);
logoimg.position.x = width / 2;
logoimg.position.y = height / 2;

// スプライトをステージに乗せる
stage.addChild(logoimg);
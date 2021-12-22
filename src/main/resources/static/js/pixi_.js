var width = 960;    // 描画エリアのサイズ
var height = 540;
var params = {
    backgroundColor: 0xa0a0a0   // 背景色の指定（灰色）
};
var renderer = PIXI.autoDetectRenderer(width, height, params);  // レンダラー生成

// DOM操作にjQueryを使用するので事前に読み込んでおくこと
$("body").append(renderer.view);    // DOMにレンダラーのビューを追加

var stage = new PIXI.Container();   // ステージを生成
renderer.render(stage);     // レンダラーにステージを描画させる

// テキストスタイル
var style = new PIXI.TextStyle({
    fontSize: 80,
    fontWeight: "bold",
    fill: 0xffffff,
    fontFamily: "hm_tb"
});

// テキストからスプライトを生成
var sprite = new PIXI.Text("Qiita", style);

sprite.anchor.set(0.5);     // 基準点をスプライトの中心にセットする
sprite.x = width / 2;       // スプライトの座標をステージの中心にする
sprite.y = height / 2;
sprite.alpha = 0.2;

stage.addChild(sprite);     // スプライトをステージに追加

renderer.render(stage);　　// ステージ描画

console.log("hogeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

var player1_pos
var player2_pos
var attack_possible_area
var move_possible_area




/** ******************************************************************* **/

actionListner1 = function (e) {
    id = e.target.id
    var fleet
    for(var i=0; i<4; i++){
        if(i>=3){
            console.log("艦未選択")
            return
        }
        if(fleetsImgs[i].select == true){
            fleet = fleetsImgs[i]
            break
        }
    }

    if(e.target.fleet>=0){
        console.log("同じ場所には配置できません")
        return
    }

    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            if(squares[i][j].fleet==fleet.id){
                squares[i][j].fleet = -1
                squares[i][j].alpha = 0.3
                break
            }
        }
    }
    e.target.fleet = fleet.id
    fleet.putPos = id
    e.target.alpha = 0.5
    console.log(fleet.id+"を"+id+"に設置")
    renderer.render(stage)
}

/** ******************************************************************* **/

reset_squares = function(){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            squares[i][j].beginFill(0x0000cd)
            //squares[i][j].drawRect(0,0,100,100)
            squares[i][j].endFill()
            squares[j][i].alpha = 0.3
            for (var k=0; k<player1_pos.length; k++){
                if (player1_pos[k][1]==i&&player1_pos[k][0]==j){
                    squares[j][i].alpha = 0.5
                    break
                }
            }
        }
    }
    renderer.render(stage)
}

/** ******************************************************************* **/

square_mask = function(area){
    remove_square_mask()
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            for(var k=0; k<area.length; k++){
                if(i==area[k][1]&&j==area[k][0]){
                    stage.addChild(square_masks[i][j])
                    break
                }
            }
        }
    }
    renderer.render(stage)
}

remove_square_mask = function(){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            for (var k=0; k<player1_pos.length; k++){
                stage.removeChild(square_masks[j][i])
            }
        }
    }
    renderer.render(stage)
}

reset_square_mask = function(){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            for (var k=0; k<player1_pos.length; k++){
                if(square_masks[j][i].alpha!=0.3){ square_masks[j][i].alpha = 0.3 }
            }
        }
    }
    renderer.render(stage)

}

/** ******************************************************************* **/

actionListner2 = function (e) {
    e.target.x = 40
    e.target.alpha = 0.5
    e.target.select = true
    fleetReset(e.target.id)
    renderer.render(stage)
    if(change_action_){
        cmd_reset()
        remove_square_mask()
        console.log(player1_pos.length)
        print_text(1)
        cmd_lock(false)
    }
}

/** ******************************************************************* **/

actionListner3 = function (e) {
    var position_data = ""
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].putPos[0]==-1){
            console.log("配置が完了していません")
            return
        }
        position_data += String(fleetsImgs[i].putPos[0])+String(fleetsImgs[i].putPos[1])+" "
    }
    console.log(position_data)
    console.log("出撃！")

    cnct_anime(true)

    post('/getPosition', position_data)

    cnct_anime(false)

    stage.removeChild(shutugeki_button)
    fleetsImgs_action_effective(false)
    squares_action_effective(false)
    fleetReset()
    change_action_ = true

    renderer.render(stage)



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

/** ******************************************************************* **/

actionListner4 = function(e){
    e.target.scale = new PIXI.Point(1.1, 1.1);
    e.target.position.x = 227
    e.target.position.y = 487
    renderer.render(stage)
}

/** ******************************************************************* **/

actionListner5 = function(e){
    shutugeki_button.scale = new PIXI.Point(1, 1);
    shutugeki_button.position.x = 240
    shutugeki_button.position.y = 500
    renderer.render(stage)
}

/** ******************************************************************* **/

actionListner6 = function(e){
    cmd_reset()
    attack_cmd.state = true
    console.log("攻撃")
    print_text(2)
    //console.log(attack_possible_area[0])
    square_mask(attack_possible_area[selected_fleet()])
    attack_cmd.alpha = 1
    renderer.render(stage)
}

/** ******************************************************************* **/

actionListner7 = function(e){
    cmd_reset()
    move_cmd.state = true
    reset_squares()
    console.log("移動")
    print_text(3)
    square_mask(move_possible_area[selected_fleet()])
    move_cmd.alpha = 1
    renderer.render(stage)
}

/** ******************************************************************* **/

var flash_kirikae = false
var flash_anime_obj
actionListner8 = function(e){
    if(flash_kirikae){
        console.log("cansel")
        window.cancelAnimationFrame(flash_anime_obj)
    }else { flash_kirikae = true ; console.log("set true")}
    reset_square_mask()
    flash_pos = e.target
    flashing_square2()
    if(attack_cmd.state){
        console.log("攻撃場所クリック")
    }else if(move_cmd.state){
        console.log("移動場所クリック")
    }
}

/** ******************************************************************* **/

cmd_reset = function(){
    if(attack_cmd.state){
        attack_cmd.alpha = 0.4
        attack_cmd.state = false
    }
    else if(move_cmd.state){
        move_cmd.alpha = 0.4
        move_cmd.state = false
    }
    renderer.render(stage)
}

/** ******************************************************************* **/

fleetReset = function (id) {
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].id==id){ continue; }
        fleetsImgs[i].x = 20
        fleetsImgs[i].alpha = 0.3
        fleetsImgs[i].select = false
    }
}

/** ******************************************************************* **/

selected_fleet = function () {
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].select){ return i ; }
    }
    return -1
}

/** ******************************************************************* **/

var change_action_ = false
/*
change_action = function () {
    for(var i=0; i<3; i++){
        fleetsImgs[i].on('click', actionListner6)
    }
    change_action_ = true
}
 */

/** ******************************************************************* **/

var width = 1440;    // 描画エリアのサイズ
var height = 810;
var params = {
    backgroundColor: 0xe0ffff   // 背景色の指定（灰色）
};

var renderer = PIXI.autoDetectRenderer(width, height, params)

// DOM操作にjQueryを使用するので事前に読み込んでおくこと
$("body").append(renderer.view);    // DOMにレンダラーのビューを追加

var stage = new PIXI.Container();   // ステージを生成
renderer.render(stage);     // レンダラーにステージを描画させる

/** ******************************************************************* **/

// テキストスタイル
var style = new PIXI.TextStyle({
    fontSize: 80,
    fontWeight: "bold",
    fill: 0x6a5acd,
    fontFamily: "hm_tb"
});

// テキストからスプライトを生成
var sprite = new PIXI.Text("Azur Fleet War", style);

sprite.anchor.set(0.5);     // 基準点をスプライトの中心にセットする
sprite.x = width / 2;       // スプライトの座標をステージの中心にする
sprite.y = height / 2;
sprite.alpha = 0.2;

stage.addChild(sprite);     // スプライトをステージに追加

renderer.render(stage);　　// ステージ描画

/** ******************************************************************* **/

var squares = []
for(var i=0; i<5; i++){
    squares[i] = []
    for(var j=0; j<5; j++){
        squares[i][j] = new PIXI.Graphics()
        squares[i][j].id = [i, j]
        squares[i][j].width = 100
        squares[i][j].height = 100
        squares[i][j].x = j * 106 + 760
        squares[i][j].y = i * 106 + 50
        squares[i][j].beginFill(0x0000cd)
        squares[i][j].drawRect(0,0,100,100)
        squares[i][j].endFill()
        squares[i][j].interactive = true
        squares[i][j].on('click', actionListner1)
        squares[i][j].alpha = 0.3
        squares[i][j].fleet = -1
        stage.addChild(squares[i][j])
    }
}

squares_action_effective = function(flag){
    if(flag){
        for(var i=0; i<5; i++) {
            for (var j = 0; j < 5; j++) {
                squares[i][j].interactive = true
            }
        }
    }else {
        for(var i=0; i<5; i++) {
            for (var j = 0; j < 5; j++) {
                squares[i][j].interactive = false
            }
        }
    }
}

renderer.render(stage)

/** ******************************************************************* **/

var square_masks = []
for(var i=0; i<5; i++){
    square_masks[i] = []
    for(var j=0; j<5; j++){
        square_masks[i][j] = new PIXI.Graphics()
        square_masks[i][j].width = 100
        square_masks[i][j].height = 100
        square_masks[i][j].x = j * 106 + 760
        square_masks[i][j].y = i * 106 + 50
        square_masks[i][j].beginFill(0xffff00)
        square_masks[i][j].drawRect(0,0,100,100)
        square_masks[i][j].endFill()
        square_masks[i][j].interactive = true
        square_masks[i][j].on('click', actionListner8)
        square_masks[i][j].alpha = 0.3
        //stage.addChild(squares_mask[i][j])
    }
}

/** ******************************************************************* **/

var fleetsImgs = []
for(var i=0; i<3; i++){
    fleetsImgs[i] =  new PIXI.Graphics()
    fleetsImgs[i].id = i
    //fleetsImgs[i].width = 380
    //fleetsImgs[i].height = 120
    fleetsImgs[i].x = 20
    fleetsImgs[i].y = i *130 +50
    fleetsImgs[i].beginFill(0xffa500)
    fleetsImgs[i].drawRect(0, 0, 400, 120)
    fleetsImgs[i].endFill()
    fleetsImgs[i].interactive = true
    fleetsImgs[i].on('click', actionListner2)
    fleetsImgs[i].alpha = 0.3
    fleetsImgs[i].select = false
    fleetsImgs[i].put = false
    fleetsImgs[i].putPos = [-1, -1]
    stage.addChild(fleetsImgs[i])
}

renderer.render(stage)

/** ******************************************************************* **/

fleetsImgs_action_effective = function(flag){
    for(var i=0; i<3; i++){
        if(flag){ fleetsImgs[i].interactive = true }
        else{ fleetsImgs[i].interactive = false }
    }
}

/** ******************************************************************* **/

loader = PIXI.loader;
loader
    .add("/images/button.png")
    .add("/images/091.png")
    .load(setup)

var shutugeki_button
function setup() {
    var texture = PIXI.Texture.fromImage('/images/button.png')
    shutugeki_button = new PIXI.Sprite(texture)
    shutugeki_button.position.x = 240
    shutugeki_button.position.y = 500
    shutugeki_button.interactive = true
    shutugeki_button.on('click', actionListner3)
    shutugeki_button.on('mouseover', actionListner4)
    shutugeki_button.on('mouseout', actionListner5)
    stage.addChild(shutugeki_button)
    renderer.render(stage)

    setup2()
}


var connecting_img
function setup2() {
    var texture2 = PIXI.Texture.fromImage('/images/091.png')
    connecting_img = new PIXI.Sprite(texture2)
    connecting_img.position.x = 1300
    connecting_img.position.y = 700
    connecting_img.anchor.x = 0.5
    connecting_img.anchor.y = 0.5
    //stage.addChild(connecting_img)
}

/** ******************************************************************* **/

// テキストスタイル
var style2 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0xdc143c,
    fontFamily: "hm_tb"
});

// テキストからスプライトを生成
var sprite2 = new PIXI.Text("作戦開始", style2);

sprite2.anchor.set(0.5);     // 基準点をスプライトの中心にセットする
sprite2.x = width / 2;       // スプライトの座標をステージの中心にする
sprite2.y = height / 2;
sprite2.alpha = 0;

//stage.addChild(sprite);     // スプライトをステージに追加

//renderer.render(stage);　　// ステージ描画

/** ******************************************************************* **/

var anime_flag = false
var render_flag = true
var count = 0
var extra_frame = 0
//var conect_state = true
function animate_connecting_img(){
    if (anime_flag){
        count += 1
        if(count>extra_frame){
            stage.removeChild(connecting_img)
            if(render_flag){
                renderer.render(stage)
                render_flag = false
                ignition.setState(false)
            }
            return
        }
    }
    requestAnimationFrame(animate_connecting_img); // 次の描画タイミングでanimateを呼び出す
    connecting_img.rotation += 0.03; // スプライトを回転する
    renderer.render(stage);   // 描画する
}

/** ******************************************************************* **/

cnct_anime = function(bool){
    if(bool){
        requestAnimationFrame(animate_connecting_img);
        count = 0
        anime_flag = false
        stage.addChild(connecting_img)
        renderer.render(stage)
    }else {
        anime_flag = true
        //
        renderer.render(stage)
    }
}

//requestAnimationFrame(animate_connecting_img);

/** ******************************************************************* **/

cut_in = function(text){
    stage.addChild(text)
    cut_in_loop(text)
}

var interval = 100
var i = 0
cut_in_loop = function(){
    i += 1
    if(i>interval){
        i = 0
        stage.removeChild(sprite2)
        cut_in2()
        return
    }else if(i>interval-33){
        sprite2.alpha -= 0.03
        renderer.render(stage)
    }else if(i<33) {
        sprite2.alpha += 0.03
        renderer.render(stage)
    }
    requestAnimationFrame(cut_in_loop)
}

/** ******************************************************************* **/

// テキストスタイル
var style3 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0x000000,
    fontFamily: "hm_tb"
});

// テキストからスプライトを生成
var sprite3 = new PIXI.Text("Your turn", style3);

sprite3.anchor.set(0.5);     // 基準点をスプライトの中心にセットする
sprite3.x = width;       // スプライトの座標をステージの中心にする
sprite3.y = height / 2;
//sprite3.alpha = 0;


cut_in2 = function(){
    stage.addChild(sprite3)
    renderer.render(stage)
    cut_in_loop2()
}

//var interval = 100
//var i = 0
cut_in_loop2 = function(){

    if(sprite3.x<=0){
        stage.removeChild(sprite3)
        renderer.render(stage)
        print_text(0)
        cmd_lock(true)
        fleetsImgs_action_effective(true)
        print_cmd()

        player1_pos = pos_parse(get("Player1Position"))
        player2_pos = pos_parse(get("Player2Position"))
        attack_possible_area = area_parse(get("AttackPossibleArea"))
        move_possible_area = area_parse(get("MovePossibleArea"))
        console.log(attack_possible_area)

        return
    }else if(i>40){
        sprite3.x -= 40
        //stage.removeChild(sprite2)
        //return
        renderer.render(stage)
    }else if(sprite3.x<=width/2){
        i += 1
        renderer.render(stage)
    }else if(sprite3.x >= width/2) {
        sprite3.x -= 40;
        renderer.render(stage)
    }
    requestAnimationFrame(cut_in_loop2)
}

/** ******************************************************************* **/
var flashing_square_flag = 1
var flash_pos
var flashing_square2 = function() {
    console.log(flashing_square_flag)
    if (flash_pos.alpha > 0.15 && flashing_square_flag == 1) {
        flash_pos.alpha -= 0.03
    } else if (flash_pos.alpha < 0.85 && flashing_square_flag == -1) {
        flash_pos.alpha += 0.03
    }else {
        flashing_square_flag *= -1
    }
    renderer.render(stage)
    flash_anime_obj = window.requestAnimationFrame(function () {
        flashing_square2()
    })
}
/** ******************************************************************* **/

post = function (url, value) {
    $.ajax({
        type: 'POST',
        url: url,
        data: value
    })
    console.log(value)
}

function get(url){
    var result = $.ajax({
        type: 'GET',
        url: url,
        async: false
    }).responseText;
    return result;
}

/** ******************************************************************* **/

make_text = function (text) {
    // テキストスタイル
    var text_style = new PIXI.TextStyle({
        fontSize: 40,
        //fontWeight: "bold",
        fill: 0x000000,
        fontFamily: "hm_tb"
    });

    // テキストからスプライトを生成
    var text_sprite = new PIXI.Text(text, text_style);

    //text_sprite.anchor.set(0.5);     // 基準点をスプライトの中心にセットする
    text_sprite.x = width*3/7;       // スプライトの座標をステージの中心にする
    text_sprite.y = height*4 / 5;

    return text_sprite
}

/** ******************************************************************* **/

game_texts = []
var text

text = "命令する艦を選択してください"
game_texts.push(make_text(text))

text = "命令を選択してください"
game_texts.push(make_text(text))

text = "攻撃目標地点を指定してください"
game_texts.push(make_text(text))

text = "移動目標地点を選択してください"
game_texts.push(make_text(text))

/** ******************************************************************* **/

var last_text
var text_flag = false

print_text = function (index) {
    if(text_flag){stage.removeChild(last_text)}
    stage.addChild(game_texts[index])
    last_text = game_texts[index]
    text_flag = true
    renderer.render(stage)
}

/** ******************************************************************* **/

var cmd_size_width = 240
var cmd_size_height = 100
var cmd_pos_x = 120
var cmd_pos_y = height*7/11
attack_cmd = new PIXI.Graphics()
move_cmd = new PIXI.Graphics()
//attack_cmd.width = cmd_size_width
//attack_cmd.height = cmd_size_height
attack_cmd.beginFill(0xdb7093)
attack_cmd.drawRect(cmd_pos_x,cmd_pos_y,cmd_size_width,cmd_size_height)
attack_cmd.alpha = 0.2
attack_cmd.interactive = true
attack_cmd.on('click', actionListner6)
attack_cmd.state = false

move_cmd.beginFill(0x32cd32)
move_cmd.drawRect(cmd_pos_x,cmd_pos_y+110,cmd_size_width,cmd_size_height)
move_cmd.alpha = 0.2
move_cmd.interactive = true
move_cmd.on('click', actionListner7)
move_cmd.state = false


/** ******************************************************************* **/

//var last_cmd_text
//var cmd_text_flag = false
print_cmd = function () {
    stage.addChild(attack_cmd)
    stage.addChild(move_cmd)
    renderer.render(stage)
}

cmd_lock = function (flag) {
    if(flag){
        attack_cmd.interactive = false
        move_cmd.interactive = false
    }else {
        attack_cmd.interactive = true
        move_cmd.interactive = true
    }
}

/** ******************************************************************* **/

function Ignition() {
    var state = 0;

    this.getState = function() {
        return state;
    };

    this.setState = function(s) {
        state = s;
        doSomething(s);
    };
}

function doSomething(s) {
    i = 0
    cut_in(sprite2)
    //console.log("イグニッション");
}

var ignition = new Ignition();


/** ******************************************************************* **/

pos_parse = function (raw_data) {
    var parsed_data = []
    var medium_data = raw_data.split('-')
    medium_data.forEach(function (value) {
        parsed_data.push(value.split(""))
    })
    return parsed_data
}

/** ******************************************************************* **/

area_parse = function (raw_data) {
    var parsed_data = []
    var medium_data = raw_data.split('+')
    medium_data.forEach(function (value) {
        parsed_data.push(pos_parse(value))
    })
    return parsed_data
}

/** ******************************************************************* **/
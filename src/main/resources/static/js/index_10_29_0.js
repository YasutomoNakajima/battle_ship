// アクションイベント
var actionListner1
var actionListner2
var actionListner3
var actionListner4
var actionListner5
var actionListner6
var actionListner7
var actionListner8
var actionListner9
var actionListner10

// グローバル変数
var game_end = false
var turn = 1
var splash = false
var hit = []
var destroy = []
var player1_pos
var player2_pos
var attack_possible_area
var move_possible_area
var second_phase = false
var next_text_index

var count = 0 // 再帰関数用カウント変数
var extra_frame = 0 // 通信中アイコンのエクストラフレーム
var cut_in_length = 100
var fade_flag = 1
var flash_position
var text_temp
var time_start
var time_now
var last_text
var text_flag = false

var fleet_type_on_map = []
var fleets_variable = []
fleets_variable[0] = new Object()
fleets_variable[1] = new Object()
fleets_variable[2] = new Object()

var box_width = 300
var box_height = 120

var flash_anime_effective = false

/***    コンポーネント    ***/
var start_screen
var click_screen
var map = []
var fleet_on_map = []
var fleetsImgs = []
var shutugeki_button
var connecting_icon
var map_mask = []
var game_texts = []
var status_messages = []

// 描画エリアのサイズ
var width = 1440
var height = 810

// サイズ
var cmd_size_width = 240
var cmd_size_height = 100
// ポジション
var cmd_pos_x = 120
var cmd_pos_y = height*7/11

/*** アニメーションオブジェクト  ***/
var connection_anime_obj
var flash_anime_obj
var cut_in_start_obj
var cut_in_my_turn_obj
var cut_in_enemy_obj
var print_status_message_obj



/***                       ***/
/***    アクションイベント     ***/
/***                       ***/

// マップの座標がクリックされたとき
actionListner1 = function (e) {
    yx = e.target.position_
    var map_position = yx
    var fleet = selected_fleet()

    if(fleet==false)return;

    //現在選択されているマップの座標上にいずれかの艦があればreturn
    if(e.target.fleet>=0){
        console.log("同じ場所には配置できません")
        return
    }

    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            if(map[j][i].fleet==fleet.id){
                map[j][i].removeChild(fleet_type_on_map[fleet.id])
                fleet_on_map[j][i].fleet = -1
                map[j][i].fleet = -1
                map[j][i].alpha = 0.3
                break
            }
        }
    }
    e.target.addChild(fleet_type_on_map[fleet.id])
    fleet_on_map[yx[0]][yx[1]].fleet = fleet.id
    e.target.fleet = fleet.id
    e.target.alpha = 0.6
    fleet.putPos = map_position
    console.log(fleet.id+"を"+map_position+"に設置")
    renderer.render(stage)
}

// 艦が選択されたとき
actionListner2 = function (e) {
    e.target.x = 40
    e.target.alpha = 0.7
    e.target.select = true
    fleetReset(e.target.id)
    if(second_phase){
        window.cancelAnimationFrame(flash_anime_obj)
        reset_map_mask()
        view_map()
        if(!masking_and_print_text())print_text(1)
        cmd_lock(false)
    }renderer.render(stage)
}

// 出撃ボタンが押されたとき
actionListner3 = function (e) {
    var position_data = ""
    print_text(5)
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].putPos[0]==-1){
            console.log("配置が完了していません")
            return
        }
        position_data += String(fleetsImgs[i].putPos[0])+String(fleetsImgs[i].putPos[1])+" "
    }
    console.log(position_data)
    console.log("出撃！")
    //connecting_icon_put(true)    // 通信中アイコン表示
    post('/getPosition', position_data)    // 配置した艦の位置情報をコントローラーに送信
    //connecting_icon_put(false)    // 通信中アイコン非表示

    stage.removeChild(shutugeki_button)   // 出撃ボタンを消す
    act_lis1_lock(true)
    act_lis2_lock(true)
    cmd_lock(true)
    fleetReset()
    second_phase = true

    for(var i=0; i<3; i++){
        xy = fleetsImgs[i].putPos
        stage.addChild(fleet_on_map[xy[0]][xy[1]])
    }
    stage.addChild(start_text)
    renderer.render(stage)
    cut_in_start()

    renderer.render(stage)
}

// 出撃ボタンにカーソルを合わせたら拡大する
actionListner4 = function(e){
    e.target.scale = new PIXI.Point(1.1, 1.1);
    e.target.position.x = 227
    e.target.position.y = 487
    renderer.render(stage)
}

// 出撃ボタンからカーソルが離れたら元のサイズに戻す
actionListner5 = function(e){
    shutugeki_button.scale = new PIXI.Point(1, 1);
    shutugeki_button.position.x = 240
    shutugeki_button.position.y = 500
    renderer.render(stage)
}

// 攻撃コマンド
actionListner6 = function(e){
    cmd_reset()
    view_map
    attack_cmd.state = true
    console.log("攻撃")
    print_text(2)
    map_masking(attack_possible_area[selected_fleet().id])
    attack_cmd.alpha = 1
    renderer.render(stage)
}

// 移動コマンド
actionListner7 = function(e){
    cmd_reset()
    move_cmd.state = true
    view_map
    console.log("移動")
    print_text(3)
    map_masking(move_possible_area[selected_fleet().id])
    move_cmd.alpha = 1
    renderer.render(stage)
}

// 攻撃/移動の目標値が選択されたとき
actionListner8 = function(e){
    if(flash_anime_effective) window.cancelAnimationFrame(flash_anime_obj)
    else { flash_anime_effective = true }
    reset_map_mask()
    flash_position = e.target
    flash_cell()
    if(attack_cmd.state){
        console.log("攻撃場所クリック")
    }else if(move_cmd.state){
        console.log("移動場所クリック")
    }
    stage.addChild(decision_btn)
    stage.addChild(cancel_btn)
    last_text.alpha = 0
    renderer.render(stage)

}

actionListner9 = function () {
    console.log("決定")
    dec_canc_btn_remove()
    stage.removeChild(last_text)
    remove_map_mask()
    pos_tmp = flash_position.position_
    pos = String(selected_fleet().id)+"+"+String(pos_tmp[0])+"+"+String(pos_tmp[1])
    s = cmd_state()
    //connecting_icon_put(true)
    if(s==0) {
        tmp = fleets_variable[selected_fleet().id].bullet_num.text
        if(parseInt(tmp)<=0){
            print_text(16)
            console.log("残弾数が0です")
            return
        }
        fleets_variable[selected_fleet().id].bullet_num.text = String(parseInt(tmp)-1)
        renderer.render(stage)
        post("attack", pos)
        var text_ = get("AttackResponse")
        console.log(text_)
        update_attack_status(text_)
        print_attack_status()
    }
    else if(s==1){
        clear_fleet_on_map()
        fleet = selected_fleet()
        fleet.putPos = [pos_tmp[1],pos_tmp[0]]
        fleet_on_map[pos_tmp[1]][pos_tmp[0]].fleet = fleet.id
        stage.removeChild(fleet_type_on_map[fleet.id])
        map[pos_tmp[1]][pos_tmp[0]].addChild(fleet_type_on_map[fleet.id])
        post("move", pos)
        player1_pos = position_parse(get("Player1Position"))
        player1_pos = position_parse(get("Player1Position"))
        view_map()
        reset_map_mask()
        set_fleet_on_map()

        // 以下
        cmd_reset()
        fleetReset()
        act_lis1_lock(true)
        act_lis2_lock(true)
        cmd_lock(true)
        count = 0
        turn *= -1
        cut_in_enemy_turn()
    }
    //connecting_icon_put(false)

    cmd_reset()
    fleetReset()
    act_lis1_lock(true)
    act_lis2_lock(true)
    cmd_lock(true)

    count = 0
    //stage.addChild(enemy_turn_text)
    //turn *= -1
    //cut_in_enemy_turn()
}

actionListner10 = function () {
    console.log("キャンセル")
    dec_canc_btn_remove()
}

actionListner11 = function (e) {
    event_obj = new Object()
    event_obj.target = fleetsImgs[e.target.fleet]
    actionListner2(event_obj)
}

actionListner12 = function () {
    post("GameStart", "true")
    stage.removeChild(start_screen)
    print_text(4)
    renderer.render(stage)
}

actionListner13 = function () {
    print_text(next_text_index)
    stage.removeChild(click_screen)
    //if(turn==-1)cut_in_enemy_turn()
    renderer.render(stage)
}

/***                       ***/
/***     描画オブジェクト     ***/
/***                       ***/

/***      ステージ      ***/
var params = {
    backgroundColor: 0xe0ffff   // 背景色の指定（灰色）
}

var renderer = PIXI.autoDetectRenderer(width, height, params)

// DOM操作にjQueryを使用するので事前に読み込んでおく
$("body").append(renderer.view)    // DOMにレンダラーのビューを追加

var stage = new PIXI.Container()   // ステージを生成
renderer.render(stage)     // レンダラーにステージを描画


/***    グラフィックス    ***/
// スタート画面
start_screen = new PIXI.Graphics()
start_screen.x = 0
start_screen.y = 0
start_screen.beginFill(0x87cefa)
start_screen.drawRect(0,0,width,height)
start_screen.endFill()
start_screen.interactive = true
start_screen.on('click', actionListner12)
start_screen.alpha = 1

// クリック待ち用透明全画面マスク
click_screen = new PIXI.Graphics()
click_screen.x = 0
click_screen.y = 0
click_screen.beginFill(0xffffff)
click_screen.drawRect(0,0,width,height)
click_screen.endFill()
click_screen.interactive = true
click_screen.on('click', actionListner13)
click_screen.alpha = 0

make_status_box = function () {
    var box = new PIXI.Graphics()
    box.beginFill(0xffffff)
    box.x = width/3-40
    box.y = height*3/4
    box.drawRect(0,0,box_width,box_height)
    box.endFill()

    var out_line = new PIXI.Graphics()
    out_line.beginFill(0x800000, 0)
    out_line.lineStyle(5, 0x800000)
    out_line.drawRect(0,0,box_width,box_height)
    out_line.endFill()
    out_line.alpha = 0.7

    box.addChild(out_line)

    return box
}

var write_text = function (box, text) {
    //
}

// マップ
for(var i=0; i<5; i++){
    map[i] = []
    for(var j=0; j<5; j++){
        map[i][j] = new PIXI.Graphics()
        map[i][j].position_ = [i, j]
        map[i][j].x = j * 106 + 760
        map[i][j].y = i * 106 + 50
        map[i][j].beginFill(0x0000cd)
        map[i][j].drawRect(0,0,100,100)
        map[i][j].endFill()
        map[i][j].interactive = true
        map[i][j].on('click', actionListner1)
        map[i][j].alpha = 0.3
        map[i][j].fleet = -1
        stage.addChild(map[i][j])
    }
}renderer.render(stage)

// マップの上に配置された艦を表すマスク
for(var i=0; i<5; i++){
    fleet_on_map[i] = []
    for(var j=0; j<5; j++){
        fleet_on_map[i][j] = new PIXI.Graphics()
        fleet_on_map[i][j].position_ = [i, j]
        fleet_on_map[i][j].x = j * 106 + 760
        fleet_on_map[i][j].y = i * 106 + 50
        fleet_on_map[i][j].beginFill(0x000000)
        fleet_on_map[i][j].drawRect(0,0,100,100)
        fleet_on_map[i][j].endFill()
        fleet_on_map[i][j].interactive = true
        fleet_on_map[i][j].on('click', actionListner11)
        fleet_on_map[i][j].alpha = 0
        fleet_on_map[i][j].fleet = -1
    }
}


// 艦隊情報
for(var i=0; i<3; i++){
    fleetsImgs[i] =  new PIXI.Graphics()
    fleetsImgs[i].id = i
    fleetsImgs[i].hp = 3-i
    fleetsImgs[i].bullet_num = (4-i)*(4-i)-(3-i)*3
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
}renderer.render(stage)

// 攻撃/移動コマンド
attack_cmd = new PIXI.Graphics()
move_cmd = new PIXI.Graphics()
attack_cmd.width = cmd_size_width
attack_cmd.height = cmd_size_height
attack_cmd.beginFill(0xdb7093)
attack_cmd.drawRect(cmd_pos_x,cmd_pos_y,cmd_size_width,cmd_size_height)
attack_cmd.alpha = 0.2
attack_cmd.interactive = true
attack_cmd.on('click', actionListner6)
attack_cmd.state = false

move_cmd.width = cmd_size_width
move_cmd.height = cmd_size_height
move_cmd.beginFill(0x32cd32)
move_cmd.drawRect(cmd_pos_x,cmd_pos_y+110,cmd_size_width,cmd_size_height)
move_cmd.alpha = 0.2
move_cmd.interactive = true
move_cmd.on('click', actionListner7)
move_cmd.state = false

// 決定/キャンセルボタン
decision_btn = new PIXI.Graphics()
cancel_btn = new PIXI.Graphics()

decision_btn.beginFill(0xff0000)
decision_btn.drawRect(width/2,height*4/5,cmd_size_width,cmd_size_height)
decision_btn.alpha = 0.6
decision_btn.interactive = true
decision_btn.on('click', actionListner9)

cancel_btn.beginFill(0x808080)
cancel_btn.drawRect(width*3/4,height*4/5,cmd_size_width,cmd_size_height)
cancel_btn.alpha = 0.6
cancel_btn.interactive = true
cancel_btn.on('click', actionListner10)

/***      画像      ***/

loader = PIXI.loader;
loader
    .add("/images/button.png")
    .add("/images/091.png")
    .load(setup)

//
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
    stage.addChild(start_screen)
    renderer.render(stage)

    var texture2 = PIXI.Texture.fromImage('/images/091.png')
    connecting_icon = new PIXI.Sprite(texture2)
    connecting_icon.position.x = 1300
    connecting_icon.position.y = 700
    connecting_icon.anchor.x = 0.5
    connecting_icon.anchor.y = 0.5
    renderer.render(stage)
}

//
for(var i=0; i<5; i++){
    map_mask[i] = []
    for(var j=0; j<5; j++){
        map_mask[i][j] = new PIXI.Graphics()
        map_mask[i][j].position_ = [j, i]
        map_mask[i][j].x = j * 106 + 760
        map_mask[i][j].y = i * 106 + 50
        map_mask[i][j].beginFill(0xffff00)
        map_mask[i][j].drawRect(0,0,100,100)
        map_mask[i][j].endFill()
        map_mask[i][j].interactive = true
        map_mask[i][j].on('click', actionListner8)
        map_mask[i][j].alpha = 0.3
    }
}


/***      テキスト      ***/
// タイトル
var style0 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0x000000,
    fontFamily: "hm_tb"
});
var title = new PIXI.Text("title", style0)
title.anchor.set(0.5)     // 基準点をスプライトの中心にセットする
title.x = width / 2       // スプライトの座標をステージの中心にする
title.y = height / 2
title.alpha = 1
start_screen.addChild(title)

// バックグラウンド文字
var style = new PIXI.TextStyle({
    fontSize: 80,
    fontWeight: "bold",
    fill: 0x6a5acd,
    fontFamily: "hm_tb"
});
var sprite = new PIXI.Text("Battle Ship", style)
sprite.anchor.set(0.5)     // 基準点をスプライトの中心にセットする
sprite.x = width / 2       // スプライトの座標をステージの中心にする
sprite.y = height / 2
sprite.alpha = 0.2
stage.addChild(sprite)     // スプライトをステージに追加
renderer.render(stage)

// 「作戦開始」
var style2 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0xdc143c,
    fontFamily: "hm_tb"
})
var start_text = new PIXI.Text("作戦開始", style2)
start_text.anchor.set(0.5)     // 基準点をスプライトの中心にセットする
start_text.x = width / 2       // スプライトの座標をステージの中心にする
start_text.y = height / 2
start_text.alpha = 0
renderer.render(stage)

// 「your turn」
var style3 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0x000000,
    fontFamily: "hm_tb"
})
var my_turn_text = new PIXI.Text("Your turn", style3);
my_turn_text.anchor.set(0.5)
my_turn_text.x = width+400;       // スプライトの座標をステージの中心にする
my_turn_text.y = height / 2;

// 「enemy turn」
var style4 = new PIXI.TextStyle({
    fontSize: 100,
    fontWeight: "bold",
    fill: 0x000000,
    fontFamily: "hm_tb"
})
var enemy_turn_text = new PIXI.Text("Enemy turn", style4);
enemy_turn_text.anchor.set(0.5)
enemy_turn_text.x = width+400;       // スプライトの座標をステージの中心にする
enemy_turn_text.y = height / 2;

/***   艦メニューに色々追加   ***/
// 艦種生成関数
add_fleet_type_on_fleet_menu = function (text, fleet_img) {
    var text_style = new PIXI.TextStyle({
        fontSize: 60,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(text, text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = fleet_img.width/10+10
    text_sprite.y = fleet_img.height/2
    fleet_img.addChild(text_sprite)
}
add_fleet_type_on_fleet_menu("戦", fleetsImgs[0])
add_fleet_type_on_fleet_menu("駆", fleetsImgs[1])
add_fleet_type_on_fleet_menu("潜", fleetsImgs[2])
renderer.render(stage)

// マップ用艦種生成関数
add_fleet_type_on_map = function (text) {
    var text_style = new PIXI.TextStyle({
        fontSize: 60,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(text, text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = 50
    text_sprite.y = 50
    return text_sprite
}
fleet_type_on_map[0] = add_fleet_type_on_map("戦")
fleet_type_on_map[1] = add_fleet_type_on_map("駆")
fleet_type_on_map[2] = add_fleet_type_on_map("潜")
renderer.render(stage)

// 生成関数
add_fleet_hp_on_fleet_menu = function (fleet_img) {
    var text_style = new PIXI.TextStyle({
        fontSize: 30,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text("残弾数:   /"+String(fleet_img.bullet_num)+"\nＨＰ　:   /"+String(fleet_img.hp), text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = fleet_img.width/2
    text_sprite.y = fleet_img.height/2
    fleet_img.addChild(text_sprite)
}
add_fleet_hp_on_fleet_menu(fleetsImgs[0])
add_fleet_hp_on_fleet_menu(fleetsImgs[1])
add_fleet_hp_on_fleet_menu(fleetsImgs[2])
renderer.render(stage)

// hpと残段数の変数テキスト
make_fleet_variable = function (text, fleet_img) {
    var text_style = new PIXI.TextStyle({
        fontSize: 30,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(String(text), text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = fleet_img.width/2+34
    text_sprite.y = fleet_img.height/2-18
    return text_sprite
}

fleets_variable[0].hp = make_fleet_variable(fleetsImgs[0].hp, fleetsImgs[0])
fleets_variable[0].hp.y += fleets_variable[0].hp.y-6
fleets_variable[0].bullet_num = make_fleet_variable(fleetsImgs[0].bullet_num, fleetsImgs[0])
fleets_variable[1].hp = make_fleet_variable(fleetsImgs[1].hp, fleetsImgs[1])
fleets_variable[1].hp.y += fleets_variable[1].hp.y-6
fleets_variable[1].bullet_num = make_fleet_variable(fleetsImgs[1].bullet_num, fleetsImgs[1])
fleets_variable[2].hp = make_fleet_variable(fleetsImgs[2].hp, fleetsImgs[2])
fleets_variable[2].hp.y += fleets_variable[2].hp.y-6
fleets_variable[2].bullet_num = make_fleet_variable(fleetsImgs[2].bullet_num, fleetsImgs[2])
fleetsImgs[0].addChild(fleets_variable[0].hp)
fleetsImgs[0].addChild(fleets_variable[0].bullet_num)
fleetsImgs[1].addChild(fleets_variable[1].hp)
fleetsImgs[1].addChild(fleets_variable[1].bullet_num)
fleetsImgs[2].addChild(fleets_variable[2].hp)
fleetsImgs[2].addChild(fleets_variable[2].bullet_num)
renderer.render(stage)
//
// cmdの文字
make_cmd_text = function (text, cmd_img) {
    var text_style = new PIXI.TextStyle({
        fontSize: 50,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(text, text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = cmd_pos_x+120
    text_sprite.y = cmd_pos_y+49
    if(text=="移動")text_sprite.y += 110
    cmd_img.addChild(text_sprite)
}
make_cmd_text("攻撃", attack_cmd)
make_cmd_text("移動", move_cmd)
renderer.render(stage)

//
// 決定/キャンセルの文字
make_dc_text = function (text, cmd_img) {
    var text_style = new PIXI.TextStyle({
        fontSize: 46,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(text, text_style);
    text_sprite.anchor.set(0.5)
    text_sprite.x = width*3/4-236
    text_sprite.y = height*4/5+48
    if(text=="キャンセル")text_sprite.x += 356
    cmd_img.addChild(text_sprite)
}
make_dc_text("決定", decision_btn)
make_dc_text("キャンセル", cancel_btn)


/***     ゲーム内説明テキスト     ***/
// 生成関数
make_text = function (text) {
    var text_style = new PIXI.TextStyle({
        fontSize: 40,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    var text_sprite = new PIXI.Text(text, text_style);
    text_sprite.x = width*3/7;       // スプライトの座標をステージの中心にする
    text_sprite.y = height*4 / 5;

    return text_sprite
}

// テキスト一覧
text_temp = "命令する艦を選択してください"    // 0
game_texts.push(make_text(text_temp))

text_temp = "命令を選択してください"         // 1
game_texts.push(make_text(text_temp))

text_temp = "攻撃目標地点を指定してください"  // 2
game_texts.push(make_text(text_temp))

text_temp = "移動目標地点を選択してください"  // 3
game_texts.push(make_text(text_temp))

text_temp = "艦隊を配置してください"         // 4
game_texts.push(make_text(text_temp))

text_temp = ""                             // 5
game_texts.push(make_text(text_temp))

text_temp = "水煙を確認　▼"                  // 6
game_texts.push(make_text(text_temp))

text_temp = "敵艦隊への直撃を確認　▼"         // 7
game_texts.push(make_text(text_temp))

text_temp = "戦艦にヒット　▼"                 // 8
game_texts.push(make_text(text_temp))

text_temp = "戦艦を撃沈しました　▼"           // 9
game_texts.push(make_text(text_temp))

text_temp = "駆逐艦にヒット　▼"               // 10
game_texts.push(make_text(text_temp))

text_temp = "駆逐艦を撃沈しました　▼"         // 11
game_texts.push(make_text(text_temp))

text_temp = "潜水艦にヒット　▼"               // 12
game_texts.push(make_text(text_temp))

text_temp = "潜水艦を撃沈しました　▼"         // 13
game_texts.push(make_text(text_temp))

text_temp = "敵主力艦隊の殲滅を確認"         // 14
game_texts.push(make_text(text_temp))

text_temp = "勝利"                          // 15
game_texts.push(make_text(text_temp))

text_temp = "残弾がありません"                // 16
game_texts.push(make_text(text_temp))


/***     ステータス表示用テキスト     ***/
make_status_text = function (text) {
    var text_style = new PIXI.TextStyle({
        fontSize: 26,
        fill: 0x000000,
        fontFamily: "hm_tb"
    })
    new_text = ""
    if(text>12){
        text = text.match(/.{11}/g)
        text.forEach(function (value) {new_text += value + "\n"})
    }else new_text = text
    var text_sprite = new PIXI.Text(new_text, text_style);
    text_sprite.x = box_width/20;
    text_sprite.y = box_height/20;

    return text_sprite
}

/***                       ***/
/***        ゲッター         ***/
/***                       ***/

// 現在選択されている艦を取得
selected_fleet = function () {
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].select == true)return fleetsImgs[i]
    }
    console.log("艦未選択")
    return false // 戻り値は艦のスプライト
}

cmd_state = function(){
    if(attack_cmd.state)return 0
    else if(move_cmd.state)return 1
    else{ return -1 }
}

fleet_type_for_id = function(id){
    if(id==0)return"戦艦"
    else if(id==1)return "駆逐艦"
    else { return "潜水艦" }
}

/***                       　　　　 ***/
/***    ボタン機能のロック/解除     ***/
/***                       　　　　***/

//
act_lis1_lock = function(flag){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            if(flag)　map[i][j].interactive = false
            else {map[i][j].interactive = true}
        }
    }
}

//
act_lis2_lock = function(flag){
    for(var i=0; i<3; i++){
        if(flag){ fleetsImgs[i].interactive = false }
        else{ fleetsImgs[i].interactive = true }
    }
}

//
cmd_lock = function (flag) {
    if(flag){
        attack_cmd.interactive = false
        move_cmd.interactive = false
    }else {
        attack_cmd.interactive = true
        move_cmd.interactive = true
    }
}


/***                        ***/
/***       描画関数         ***/
/***                       ***/
// マップに艦を設置
put_fleet = function(){
    //
}

put_click_screen = function(){
    stage.addChild(click_screen)
    renderer.render(stage)
}

// マップに艦を描画
view_map = function(){
    reset_map()
    for (var k=0; k<player1_pos.length; k++){
        xy = player1_pos[k]
        map[xy[0]][xy[1]].alpha = 0.6
        map[xy[0]][xy[1]].fleet = k
        stage.addChild(fleet_on_map[xy[0]][xy[1]])
    }renderer.render(stage)
}

// マップをまっさらにする
reset_map = function () {
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            map[i][j].fleet = -1
            map[j][i].alpha = 0.3
        }
    }renderer.render(stage)
}

set_fleet_on_map = function(){
    for (var k=0; k<player1_pos.length; k++){
        xy = player1_pos[k]
        stage.addChild(fleet_on_map[xy[0]][xy[1]])
    }renderer.render(stage)
}

clear_fleet_on_map = function(){
    console.log("fleet_on_mapをクリアしました")
    for(var i=0; i<3; i++){
        xy = fleetsImgs[i].putPos
        stage.removeChild(fleet_on_map[xy[0]][xy[1]])
    }renderer.render(stage)
}

// 艦の選択をすべて取り消す
fleetReset = function (id) {
    for(var i=0; i<3; i++){
        if(fleetsImgs[i].id==id){ continue; }
        fleetsImgs[i].x = 20
        fleetsImgs[i].alpha = 0.3
        fleetsImgs[i].select = false
    }renderer.render(stage)
}

//
map_masking = function(area){
    console.log(area)
    remove_map_mask()
    for(var k=0; k<area.length; k++){
        xy = area[k]
        stage.addChild(map_mask[xy[1]][xy[0]])
    }renderer.render(stage)
}

//
masking_and_print_text = function(){
    var s = cmd_state()
    if(s==0){
        map_masking(attack_possible_area[selected_fleet().id])
        //print_text(3)
        return true
    }
    else if(s==1){
        map_masking(move_possible_area[selected_fleet().id])
        //print_text(4)
        return true
    }
    return false
}

//
remove_map_mask = function(){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            stage.removeChild(map_mask[j][i])
        }
    }renderer.render(stage)
}

//
reset_map_mask = function(){
    for(var i=0; i<5; i++) {
        for (var j = 0; j < 5; j++) {
            if(map_mask[j][i].alpha!=0.3){ map_mask[j][i].alpha = 0.3 }
        }
    }renderer.render(stage)
}

// コマンド選択ボタンをリセット
cmd_reset = function(){
    if(attack_cmd.state){
        attack_cmd.alpha = 0.4
        attack_cmd.state = false
    }
    else if(move_cmd.state){
        move_cmd.alpha = 0.4
        move_cmd.state = false
    }
    window.cancelAnimationFrame(flash_anime_obj)
    reset_map_mask()
    renderer.render(stage)
}

// ゲーム内説明テキストを表示
// 引数はgame_textsのインデックス
print_text = function (index) {
    if(text_flag){stage.removeChild(last_text)}
    stage.addChild(game_texts[index])
    last_text = game_texts[index]
    text_flag = true
    renderer.render(stage)
}

// コマンドボタンを表示
print_cmd = function () {
    stage.addChild(attack_cmd)
    stage.addChild(move_cmd)
    renderer.render(stage)
}

dec_canc_btn_remove = function(){
    stage.removeChild(decision_btn)
    stage.removeChild(cancel_btn)
    window.cancelAnimationFrame(flash_anime_obj)
    reset_map_mask()
    last_text.alpha = 1
    renderer.render(stage)
}

print_attack_status = function(){
    var text
    var fleet_type
    print_status_message_i = 0
    status_messages = []
    if(!splash && hit.length==0){
        text = "何も起こらなかった"
        status_messages.push(make_status_message(text))
        console.log(text)
        //return
    }
    if(hit.length>0){
        for(var i=0; i<hit.length; i++){
            fleet_type = fleet_type_for_id(hit[i])
            text = fleet_type+"にヒット!"
            status_messages.push(make_status_message(text))
            console.log(text)
            if(destroy.indexOf(hit[i])!=-1){
                fleet_type = fleet_type_for_id(hit[i])
                text = fleet_type+"を撃沈させた!"
                status_messages.push(make_status_message(text))
                console.log(text)
                if(destroy.length>=3){
                    print_text(15)
                    console.log("勝利")
                    game_end = true
                }
            }
        }
    }
    if(splash){
        text = "水煙を確認"
        status_messages.push(make_status_message(text))
        console.log(text)
    }
    count = 0
    print_status_message()
}

make_status_message = function(text){
    text_sprite = make_status_text(text)
    box = make_status_box()
    box.addChild(text_sprite)
    return box
}


/***                       ***/
/***      アニメーション      ***/
/***                       ***/

/***   通信中アイコン   ***/
//
connecting_icon_put = function(bool){
    if(bool){
        stage.addChild(connecting_icon)
        renderer.render(stage)
        connecting_anime()
    }else {
        cancelAnimationFrame(connection_anime_obj)
        extra_connecting_anime()
        count = 0
        stage.removeChild(connecting_icon)
        renderer.render(stage)
    }
}

//
function connecting_anime(){
    connecting_icon.rotation += 0.03; // スプライトを回転する
    connection_anime_obj = requestAnimationFrame(connecting_anime); // 次の描画タイミングでanimateを呼び出す
    renderer.render(stage);   // 描画する
}

//
function extra_connecting_anime(){
    count += 1
    if(count>=extra_frame) cancelAnimationFrame(connection_anime_obj)
    connecting_icon.rotation += 0.03; // スプライトを回転する
    connection_anime_obj = requestAnimationFrame(connecting_anime); // 次の描画タイミングでanimateを呼び出す
    renderer.render(stage);   // 描画する
}

/***   作戦開始カットイン   ***/
// 使うときはcountを0にしてね☆
// あとstage.addChild(start_text)もしてね☆
cut_in_start = function(){
    count += 1
    if(count>cut_in_length){
        count = 0
        cancelAnimationFrame(cut_in_start_obj)
        stage.removeChild(start_text)
        stage.addChild(my_turn_text)
        renderer.render(stage)
        console.log("スタートカットインを表示しました\nマイターンカットインを表示します")
        cut_in_my_turn()
        return
    }else if(count>cut_in_length-33){
        start_text.alpha -= 0.03
        renderer.render(stage)
    }else if(count<33) {
        start_text.alpha += 0.03
        renderer.render(stage)
    }
    cut_in_start_obj = requestAnimationFrame(cut_in_start)
}

/***    Your turnカットイン    ***/
// 使うときはstage.addChild(my_turn_text)してね☆
cut_in_my_turn = function(){
    if(my_turn_text.x<=-1000){
        cancelAnimationFrame(cut_in_my_turn_obj)
        renderer.render(stage)
        print_text(0)
        print_cmd()
        act_lis2_lock(false)

        player1_pos = position_parse(get("Player1Position"))
        //player2_pos = position_parse(get("Player2Position"))
        attack_possible_area = area_parse(get("AttackPossibleArea"))
        move_possible_area = area_parse(get("MovePossibleArea"))

        my_turn_text.x = width+400;
        count = 0
        return
    }else if(count>40){
        my_turn_text.x -= 50
        renderer.render(stage)
    }else if(my_turn_text.x<=width/2){
        count += 1
        renderer.render(stage)
    }else if(my_turn_text.x >= width/2) {
        my_turn_text.x -= 50;
        renderer.render(stage)
    }
    cut_in_my_turn_obj = requestAnimationFrame(cut_in_my_turn)
}

/***    Enemy turnカットイン    ***/
// 使うときはstage.addChild(enemy_turn_text)してね☆
cut_in_enemy_turn = function(){
    if(enemy_turn_text.x<=-1000){
        cancelAnimationFrame(cut_in_enemy_obj)
        renderer.render(stage)

        enemy_turn_text.x = width+400;
        count = 0
        turn *= -1
        console.log("エネミーターンカットイン終了")
        cut_in_my_turn()
        return
    }else if(count>40){
        enemy_turn_text.x -= 50
        renderer.render(stage)
    }else if(enemy_turn_text.x<=width/2){
        count += 1
        renderer.render(stage)
    }else if(enemy_turn_text.x >= width/2) {
        enemy_turn_text.x -= 50;
        renderer.render(stage)
    }
    cut_in_enemy_obj = requestAnimationFrame(cut_in_enemy_turn)
}

/***    選択したマップのセルを点滅させる    ***/
var flash_cell = function() {
    if (flash_position.alpha > 0.15 && fade_flag == 1) {
        flash_position.alpha -= 0.03
    } else if (flash_position.alpha < 0.85 && fade_flag == -1) {
        flash_position.alpha += 0.03
    }else {
        fade_flag *= -1
    }
    renderer.render(stage)
    flash_anime_obj = window.requestAnimationFrame(function () {
        flash_cell()
    })
}

/***   ステータスメッセージを表示   ***/
var print_status_message_i = 0
var print_status_message = function(){
    if(print_status_message_i==status_messages.length && count<=100){
        count += 1
    }else if(print_status_message_i>=status_messages.length){
        for(var i=0; i<print_status_message_i; i++){ stage.removeChild(status_messages[i]) }
        renderer.render(stage)
        cancelAnimationFrame(print_status_message_obj)
        cmd_reset()
        fleetReset()
        act_lis1_lock(true)
        act_lis2_lock(true)
        cmd_lock(true)
        count = 0
        turn *= -1
        console.log("ステータスメッセージを表示しました。\nエネミーターンカットインを呼びます")
        cut_in_enemy_turn()
        return
    }else{
        stage.addChild(status_messages[print_status_message_i])
        renderer.render(stage)
    }
    if (count==0&&status_messages[print_status_message_i].y >= (box_height+18)*print_status_message_i+50+150)status_messages[print_status_message_i].y -= 30
    else if(count==0&&status_messages[print_status_message_i].y >= (box_height+18)*print_status_message_i+50)status_messages[print_status_message_i].y -= 20
    else if(count==0){
        print_status_message_i += 1
    }
    renderer.render(stage)
    print_status_message_obj = window.requestAnimationFrame(function () {
        print_status_message()
    })
}

/***                       ***/
/***      Ajax通信関数      ***/
/***                       ***/

// POST
post = function (url, value) {
    $.ajax({
        type: 'POST',
        url: url,
        data: value
    })
    //console.log(value)
}

// GET
function get(url){
    var result = $.ajax({
        type: 'GET',
        url: url,
        async: false
    }).responseText;
    return result;
}

// GETしたテキストのパース
position_parse = function (raw_data) {
    var parsed_data = []
    var medium_data = raw_data.split('-')
    medium_data.forEach(function (value) {
        parsed_data.push(value.split(""))
    })
    return parsed_data
}

area_parse = function (raw_data) {
    var parsed_data = []
    var medium_data = raw_data.split('+')
    medium_data.forEach(function (value) {
        parsed_data.push(position_parse(value))
    })
    return parsed_data
}

update_attack_status = function (raw_data) {
    hit = []
    splash = false
    var parsed_data = []
    var medium_data = raw_data.split('-')
    medium_data.forEach(function (value) {
        if(value=="m")splash = true
        else if(value=="1")hit.push(0)
        else if(value=="2")hit.push(1)
        else if(value=="3")hit.push(2)
        else if(value=="1d"){
            hit.push(0)
            destroy.push(0)
        }
        else if(value=="2d"){
            hit.push(1)
            destroy.push(1)
        }
        else if(value=="3d"){
            hit.push(2)
            destroy.push(2)
        }
    })
}



/***                               ***/
/***                               ***/
/***                               ***/
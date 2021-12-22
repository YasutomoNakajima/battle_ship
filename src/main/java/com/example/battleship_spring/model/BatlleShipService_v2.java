package com.example.battleship_spring.model;

import com.example.battleship_spring.JRubyConection;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;

@Service
public class BatlleShipService_v2 {

    private JRubyConection player1;
    private JRubyConection player2;
    final private String BattleShipEngine = "src/main/ruby/Relay_v2.rb" ;
    private Boolean FleetPutFlag = false;
    private int turn;

    /***  version 1.0.1ではこのinitializeをコメントアウト  ***/
    /*
    public BatlleShipService(){
        this.player1 = new JRubyConection(battleShipEngine);
        this.player2 = new JRubyConection(battleShipEngine);
    }
    */
    public void gameStart(){
        System.out.println("新たにゲームが開始されました(開発中 version2)");
        this.player1 = new JRubyConection(BattleShipEngine);
        this.player2 = new JRubyConection(BattleShipEngine);
        FleetPutFlag = false;
        this.turn = 0;
    }

    public Boolean getFleetPutFlag(){ return this.FleetPutFlag; }

    public void setFleetPutFlag() { FleetPutFlag = true; }

    public void putFleet(Map map){
        player1.call_method("put_fleet", map);
    }
    public void autoPutFleet(){
        player2.call_method("auto_put");
    }

    public void consoleView(){
        System.out.println("(player1)");
        player1.call_method("console_view", "");
        System.out.println("\n(player2)");
        player2.call_method("console_view", "");
    }

    public Object enemyPosition(){return player2.call_method("position", "");}

    //old
    public String getPositionPlayer1(){
        return player1.call_method("get_position", "");
    }
    public String getPositionPlayer2(){
        return player2.call_method("get_position", "");
    }

    public Object actionPossibleArea(){
        return player1.call_method("action_possible_area");
    }

    //new
    public Object attackPlayer1(Map positionData){
        this.turn++;
        return player2.call_method("attack", positionData);
    }
    public Object movePlayer1(Map positionData){
        this.turn++;
        return player1.call_method("move", positionData);
    }

    //old
    //public void attackPlayer2(String positionData) { player2.call_method("attack", positionData); }
    public String attackStatementPlayer1(){
        return player2.call_method("attack_statement", "");
    }
    public String attackStatementPlayer2(){
        return player1.call_method("attack_statement", "");
    }

    public Object actionCpu(){
        boolean flag  = Boolean.valueOf(player2.call_method("cpu_possible_action", ""));
        Random random = new Random();
        int n = 0;
        if(flag) n = random.nextInt(11);
        String actionStatus;
        if(n>4){
            actionStatus = player2.call_method("cpu_attack", "");
            actionStatus = player1.call_method("cpu_attack2", actionStatus);
        }else{
            actionStatus = player2.call_method("cpu_move", "");
            consoleView();
        }
        return actionStatus;
    }

    public LinkedHashMap<String, Integer> result(){
        LinkedHashMap<String, Integer> map = new LinkedHashMap<>();
        map.put("turn", this.turn);
        Object obj = player1.call_method("game_end?", "");
        Object obj2 = player2.call_method("game_end?", "");
        boolean flag = Boolean.valueOf(obj.toString());
        boolean flag2 = Boolean.valueOf(obj2.toString());
        if(flag){
            map.put("winner", 1);
            return map;
        }
        if (flag2){
            map.put("winner", 0);
            return map;
        }
        map.put("winner", -1);
        return map;
    }
}

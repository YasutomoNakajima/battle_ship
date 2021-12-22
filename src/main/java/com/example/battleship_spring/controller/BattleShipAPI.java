package com.example.battleship_spring.controller;

import com.example.battleship_spring.model.BatlleShipService_v2;
import com.example.battleship_spring.model.LogService;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@Controller
public class BattleShipAPI {

    @Autowired
    private BatlleShipService_v2 service;

    @Autowired
    private LogService logService;

    @GetMapping("api_Player1Position")
    @ResponseBody
    public String player1Position(){ return service.getPositionPlayer1(); }

    @GetMapping("api_Player2Position")
    @ResponseBody
    public String player2Position(){ return service.getPositionPlayer2(); }

    @GetMapping("api_action_possible_area")
    @ResponseBody
    public Object actionPossibleArea(){ return service.actionPossibleArea(); }

    @GetMapping("api_api_AttackResponse")
    @ResponseBody
    public String attackRenponse(){ return service.attackStatementPlayer1(); }

    @GetMapping("api_AttackResponse2")
    @ResponseBody
    public String attackRenponse2(){ return service.attackStatementPlayer2(); }

    @GetMapping("api_cpu_action")
    @ResponseBody
    public Object actionCpuResponse(){ return service.actionCpu(); }

    @GetMapping("api_begin_game")
    @ResponseBody
    public String gameStart(){
        service.gameStart();
        return  IndexController2.html;
    }

    @GetMapping("api_result")
    @ResponseBody
    public Object result(){
        var result = service.result();
        logService.register(00000, result.get("turn"), result.get("winner"));
        return result;
    }

    @GetMapping("api_battle_logs")
    @ResponseBody
    public Object battleLogs(){
        return logService.findForUserId(00000);
    }

    @GetMapping("api_enemy_data")
    @ResponseBody
    public Object enemyData(){return service.enemyPosition();}

    @PostMapping("api_stand_by")
    @ResponseBody
    Object standBy(@RequestParam Map map) {
        if (service.getFleetPutFlag()){
            System.out.println("設置は完了しています");
            return new Object();
        }else {
            service.putFleet(map);
            System.out.println("player1 set ok");
            service.autoPutFleet();
            System.out.println("player2(CPU) set ok");
            service.setFleetPutFlag();
        }
        service.consoleView();
        return service.actionPossibleArea();
    }

    @PostMapping("api_attack")
    @ResponseBody
    Object attack(@RequestParam Map map){
        return service.attackPlayer1(map);
    }

    @PostMapping("api_move")
    @ResponseBody
    Object move(@RequestParam Map map){
        var blank_json = service.movePlayer1(map);
        service.consoleView();
        return blank_json;
    }

    /***    version2   ***/
    //アノテーションにJSONエンコーダが内蔵されているのでJSにオブジェクトを直接リターンできる
    @PostMapping("getPosition_json")//getPosition_json
    public @ResponseBody String post(@RequestParam Map data, HttpServletRequest request) throws JsonParseException, JsonMappingException, IOException {
        return "";
    }

}

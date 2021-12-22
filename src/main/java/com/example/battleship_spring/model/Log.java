package com.example.battleship_spring.model;

import javax.validation.constraints.Null;
import java.time.LocalDateTime;

public class Log {
    private int userId;
    private int turn;
    private int winner;
    private LocalDateTime time;
    private int battleNumber;

    public Log(){}
    public Log(int userId, int turn, int winner){
        this.userId = userId;
        this.turn = turn;
        this.winner = winner;
        this.time = LocalDateTime.now();
        this.battleNumber = -1;
    }public Log(int userId, int turn, int winner, LocalDateTime time, int battleNumber){
        this.userId = userId;
        this.turn = turn;
        this.winner = winner;
        this.time = time;
        this.battleNumber = battleNumber;
    }

    public int getTurn() {
        return turn;
    }

    public int getUserId() {
        return userId;
    }

    public int getWinner() {
        return winner;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public int getBattleNumber() {
        return battleNumber;
    }

    public void setTurn(int turn) {
        this.turn = turn;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setWinner(int winner) {
        this.winner = winner;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public void setBattleNumber(int battleNumber) {
        this.battleNumber = battleNumber;
    }
}

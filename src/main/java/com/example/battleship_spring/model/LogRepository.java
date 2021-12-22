package com.example.battleship_spring.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

import static org.springframework.jdbc.core.BeanPropertyRowMapper.newInstance;

@Repository
public class LogRepository {

    @Autowired
    public JdbcTemplate jdbcTemplate;

    public void insert(Log log){
        String sql = "insert into log(user_id, turn, winner, time) values(?,?,?,?)";
        jdbcTemplate.update(sql, log.getUserId(), log.getTurn(), log.getWinner(), log.getTime());
    }

    public List<Log> select(int userId){
        String sql = "select turn, winner, time, battle_number from log where user_id=? order by battle_number desc limit 18";
        return jdbcTemplate.query(sql, newInstance(Log.class), userId);
    }
}

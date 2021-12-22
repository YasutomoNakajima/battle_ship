package com.example.battleship_spring.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Collections.emptyList;
import static org.springframework.jdbc.core.BeanPropertyRowMapper.newInstance;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public int register(int userId, int turn, int winner){
        Log log = new Log(userId, turn, winner);
        try{
            logRepository.insert(log);
        }catch (DataAccessException e){
            e.printStackTrace();
            return 1;
        }
        return 0;
    }

    public List<Log> findForUserId(int userId){
        try{
            return logRepository.select(userId);
        }catch (DataAccessException e){
            e.printStackTrace();
        }
        return emptyList();
    }

}

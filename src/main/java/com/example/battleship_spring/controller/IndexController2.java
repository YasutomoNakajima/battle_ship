package com.example.battleship_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Controller
public class IndexController2 {

    public static String html;

    @GetMapping("prototype")
    String index2(){
        this.html = "index4";
        return html;
    }

    @GetMapping("prototype2")
    String index3(){
        this.html = "index4_v_a1_1_0";
        return this.html;
    }

    @GetMapping("prototype3")
    String index4(){
        this.html = "index4_v_a2_0_0";
        return this.html;
    }

    @GetMapping("about")
    String index5(){
        return "about";
    }
}

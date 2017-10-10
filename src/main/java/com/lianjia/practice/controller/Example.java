package com.lianjia.practice.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by changlu on 10/10/17.
 */
@Controller
@EnableAutoConfiguration
@RequestMapping("/*")
@ComponentScan(basePackages = {"com.lianjia.practice"})
public class Example{

    @GetMapping(value="/thymeleaf")
    public String thymeleaf(Map<String,String> model){
        model.put("word","你好！Thymeleaf");
        return "/thymeleaf/index";
    }

    public static void main(String[] args){
        SpringApplication.run(Example.class, args);
    }
}

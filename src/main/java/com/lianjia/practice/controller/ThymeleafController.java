package com.lianjia.practice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by changlu on 10/10/17.
 */
@Controller
@RequestMapping("/*")
public class ThymeleafController {

    @RequestMapping("/hello")
    @ResponseBody
    public String thymeleaf(Map<String,String> model){
        return "Hello Spring Boot! Package scan to find this mapping";
    }
    @RequestMapping(value = "/autoComplete",method = RequestMethod.GET)
    @ResponseBody
    public String[] autoComplete(String keyword){
        String[] result = new String[3];
        for(int i=0;i<result.length;i++){
            result[i] = keyword + i;
        }
        return result;
    }
}

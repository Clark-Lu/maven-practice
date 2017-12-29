package com.lianjia.practice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by changlu on 11/2/17.
 */
@Controller
public class Directive {
    @RequestMapping(value = "/directive",method = RequestMethod.GET)
    public String directive(){
        return "/directive/index";
    }
}

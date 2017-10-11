package com.lianjia.practice.controller;

import org.apache.log4j.spi.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * Created by changlu on 10/10/17.
 */
@Controller
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.lianjia.practice"})
public class Example{

    private static org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(Example.class);

    @GetMapping(value="/thymeleaf")
    public String thymeleaf(Map<String,String> model){
        model.put("word","你好！Thymeleaf");
        return "/thymeleaf/index";
    }
    @GetMapping(value = "/bootstrap")
    public String bootstrap(Map<String,String> model){
        model.put("word","Hello bootstrap");
        logger.info("bootstrap");
        return "/bootstrap/index";
    }
    @GetMapping("/example")
    public String example(){
        return "/example/index";
    }
    @RequestMapping(value = "/upload")
    @ResponseBody
    public Map<String,String> upload(@RequestParam(value = "file")MultipartFile file) {
        Map<String,String> result = new HashMap<String, String>();
        if(file == null){
            result.put("msg","empty file");
            return result;
        }
        if(file.isEmpty()){
            result.put("msg","empty file");
            return result;
        }
        String fileName = file.getOriginalFilename();
        String fileSuffix = fileName.substring(fileName.lastIndexOf("."));
        logger.info("fileName:"+fileName);
        logger.info("fileSuffix:"+fileSuffix);
        String filePath = "/Users/changlu/";
        File dist = new File(filePath+fileName);
        try {
            file.transferTo(dist);
            result.put("msg","success");
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("msg","error");
            return result;
        }
    }
    public static void main(String[] args){
        SpringApplication.run(Example.class, args);
    }
}

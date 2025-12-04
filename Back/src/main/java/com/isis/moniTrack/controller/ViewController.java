package com.isis.moniTrack.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @RequestMapping("/")
    public String login() {
        return "login"; 
    }

    @RequestMapping("/home")
    public String home() { 
        return "index";  
        
    }
    
}

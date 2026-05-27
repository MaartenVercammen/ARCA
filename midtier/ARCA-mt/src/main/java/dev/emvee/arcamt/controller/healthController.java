package dev.emvee.arcamt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class healthController {

    @GetMapping("/health")
    public String healthCheck() {
        return "healthy";
    }
}

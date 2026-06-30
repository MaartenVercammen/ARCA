package dev.emvee.arcamt.auth.controller;

import dev.emvee.arcamt.auth.model.LoginRequest;
import dev.emvee.arcamt.auth.service.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authentication")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid LoginRequest loginRequest, HttpServletResponse response) {
        String token = authenticationService.login(loginRequest);
        response.addCookie(new Cookie("token", token));
        return ResponseEntity.ok("Logged in");
    }

    @PostMapping("/signup")
    public String signup(@RequestBody @Valid LoginRequest loginRequest) {
       return authenticationService.signup(loginRequest) + " has been created";
    }

}

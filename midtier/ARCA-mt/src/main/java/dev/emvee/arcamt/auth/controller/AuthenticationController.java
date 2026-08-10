package dev.emvee.arcamt.auth.controller;

import dev.emvee.arcamt.auth.model.dto.LoginRequest;
import dev.emvee.arcamt.auth.model.dto.UserDto;
import dev.emvee.arcamt.auth.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<UserDto> login(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(authenticationService.login(loginRequest));
    }

    @PostMapping("/signup")
    public String signup(@RequestBody @Valid LoginRequest loginRequest) {
       return authenticationService.signup(loginRequest) + " has been created";
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserDto> refreshToken(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshToken));
    }

}

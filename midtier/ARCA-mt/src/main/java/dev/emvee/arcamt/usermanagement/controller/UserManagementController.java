package dev.emvee.arcamt.usermanagement.controller;

import dev.emvee.arcamt.usermanagement.dto.UserDto;
import dev.emvee.arcamt.usermanagement.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserManagementController {

    private final UserManagementService userManagementService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/users")
    public List<UserDto> getUsers() {
        return userManagementService.getUsers();
    }
}

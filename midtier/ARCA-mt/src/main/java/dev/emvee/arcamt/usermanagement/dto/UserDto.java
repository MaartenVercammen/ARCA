package dev.emvee.arcamt.usermanagement.dto;

import dev.emvee.arcamt.usermanagement.repository.model.Role;

import java.util.Set;

public record UserDto(
        String UserName,
        Set<Role> Roles
) {
}

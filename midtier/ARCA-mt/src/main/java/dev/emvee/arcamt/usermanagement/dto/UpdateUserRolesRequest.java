package dev.emvee.arcamt.usermanagement.dto;

import dev.emvee.arcamt.usermanagement.repository.model.Role;
import lombok.Builder;

import java.util.Set;

@Builder
public record UpdateUserRolesRequest(
        Set<Role> roles
) {
}

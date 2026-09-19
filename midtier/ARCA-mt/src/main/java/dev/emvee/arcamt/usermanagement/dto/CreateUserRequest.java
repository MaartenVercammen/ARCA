package dev.emvee.arcamt.usermanagement.dto;

import dev.emvee.arcamt.usermanagement.repository.model.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.util.Set;

@Builder
public record CreateUserRequest(
        @NotBlank String username,
        @NotBlank String password,
        String email,
        String phoneNumber,
        AddressDto address,
        Set<Role> roles
) {
}

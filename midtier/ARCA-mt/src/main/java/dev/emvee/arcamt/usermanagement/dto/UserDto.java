package dev.emvee.arcamt.usermanagement.dto;

import dev.emvee.arcamt.usermanagement.repository.model.Role;
import lombok.Builder;

import java.util.Set;

@Builder
public record UserDto(
        Long id,
        String username,
        String email,
        String phoneNumber,
        AddressDto address,
        Set<Role> roles
) {
}

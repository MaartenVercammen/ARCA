package dev.emvee.arcamt.usermanagement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UpdateUserRequest(
        @NotBlank String username,
        String email,
        String phoneNumber,
        AddressDto address
) {
}

package dev.emvee.arcamt.auth.model.dto;

import lombok.Builder;

@Builder
public record UserDto(
        String username,
        String accessToken,
        String refreshToken
) {
}

package dev.emvee.arcamt.usermanagement.dto;

import lombok.Builder;

@Builder
public record AddressDto(
        String street,
        String houseNumber,
        String city,
        String zipCode,
        String country
) {
}

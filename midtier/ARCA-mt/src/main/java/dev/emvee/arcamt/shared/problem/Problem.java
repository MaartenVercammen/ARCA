package dev.emvee.arcamt.shared.problem;

import lombok.Builder;
import org.springframework.http.HttpStatus;

@Builder
public record Problem(
        HttpStatus httpStatus,
        String message
) {
}

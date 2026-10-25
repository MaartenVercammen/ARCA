package dev.emvee.arcamt.shared.problem;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@ControllerAdvice
public class SharedControllerAdvice {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Problem> handleException(Exception ex) {
        log.error("An error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.internalServerError()
                .body(Problem.builder()
                        .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Problem> handleRuntimeException(RuntimeException ex) {
        log.error("An error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.internalServerError()
                .body(Problem.builder()
                        .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    public ResponseEntity<Problem> handleBadRequestException(HttpClientErrorException.BadRequest ex) {
        log.error("An error occurred: {}", ex.getMessage(), ex);
        return ResponseEntity.badRequest()
                .body(Problem.builder()
                        .httpStatus(HttpStatus.BAD_REQUEST)
                        .message(ex.getMessage())
                        .build());
    }

}

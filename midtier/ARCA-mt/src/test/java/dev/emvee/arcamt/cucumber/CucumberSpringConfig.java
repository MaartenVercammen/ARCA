package dev.emvee.arcamt.cucumber;

import dev.emvee.arcamt.core.security.JwtAuthenticationFilter;
import dev.emvee.arcamt.usermanagement.controller.UserManagementController;
import dev.emvee.arcamt.usermanagement.service.UserManagementService;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@CucumberContextConfiguration
@WebMvcTest(
        value = UserManagementController.class,
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class
        )
)
@Import({CucumberSpringConfig.MethodSecurityConfig.class, CucumberSpringConfig.AccessDeniedHandler.class})
public class CucumberSpringConfig {

    @MockitoBean
    UserManagementService userManagementService;

    @TestConfiguration
    @EnableMethodSecurity
    static class MethodSecurityConfig {
    }

    @RestControllerAdvice
    @Order(Ordered.HIGHEST_PRECEDENCE)
    static class AccessDeniedHandler {

        @ExceptionHandler({AccessDeniedException.class, AuthorizationDeniedException.class})
        @ResponseStatus(HttpStatus.FORBIDDEN)
        void handleAccessDenied() {
        }

        @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
        @ResponseStatus(HttpStatus.UNAUTHORIZED)
        void handleNotAuthenticated() {
        }
    }
}

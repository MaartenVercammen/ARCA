package dev.emvee.arcamt.usermanagement.controller;

import dev.emvee.arcamt.core.security.JwtAuthenticationFilter;
import dev.emvee.arcamt.usermanagement.mock.UserMocks;
import dev.emvee.arcamt.usermanagement.service.UserManagementService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Fast, slice-level tests for {@link UserManagementController}.
 * <p>
 * This test only loads the {@code UserManagementController} and Spring Security's
 * method security support. It does NOT go through the real {@code JwtAuthenticationFilter}
 * or {@code JwtService} - authentication is simulated with {@link WithMockUser} /
 * {@link WithAnonymousUser}. This keeps the test fast and focused purely on verifying
 * the controller's {@code @PreAuthorize} annotations.
 */
@ExtendWith(SpringExtension.class)
@WebMvcTest(value = UserManagementController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = JwtAuthenticationFilter.class))
@Import({UserManagementControllerTest.MethodSecurityTestConfig.class, UserManagementControllerTest.AccessDeniedTestExceptionHandler.class})
class UserManagementControllerTest {

    @TestConfiguration
    @EnableMethodSecurity
    static class MethodSecurityTestConfig {
    }

    /**
     * The full {@code SecurityFilterChain} (with its {@code ExceptionTranslationFilter}) is not loaded in
     * this slice test, so {@code @PreAuthorize} failures would otherwise surface as an unhandled exception
     * instead of a 403 response. This advice replicates that translation for the purposes of this test.
     */
    @RestControllerAdvice
    static class AccessDeniedTestExceptionHandler {

        @ExceptionHandler(AccessDeniedException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN)
        void handleAccessDenied() {
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserManagementService userManagementService;

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Get all users returns all users for user")
    void getAllUsers_Returns_AllUsers() throws Exception {
        // Arrange
        when(userManagementService.getUsers()).thenReturn(UserMocks.usersDto);
        // Act & Assert
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(UserMocks.usersDto.size())));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Get all users returns 403 for role without access")
    void getAllUsers_WrongRole_Returns_403() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    @DisplayName("Get all users returns 403 for anonymous user")
    void getAllUsers_AnonymousUser_Return_403() throws Exception {
        mockMvc.perform(get("/users"))
                .andExpect(status().isForbidden());
    }

}

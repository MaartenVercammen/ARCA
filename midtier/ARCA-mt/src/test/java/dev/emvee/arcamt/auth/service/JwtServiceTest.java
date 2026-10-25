package dev.emvee.arcamt.auth.service;

import dev.emvee.arcamt.core.security.UserContext;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "mySecretKeyForTestingJwtServiceLongEnoughForHS512AlgorithmSecurityRequirements1234567890!");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000);
        jwtService.init();
    }

    @Test
    void testGenerateTokenAndExtractUserContext() {
        User user = User.builder()
                .id(42L)
                .username("alice")
                .email("alice@example.com")
                .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_USER))
                .build();

        String token = jwtService.generateToken(user);
        assertThat(token).isNotBlank();
        assertThat(jwtService.validateJwtToken(token)).isTrue();

        UserContext context = jwtService.getUserContextFromJwtToken(token);
        assertThat(context).isNotNull();
        assertThat(context.getUserId()).isEqualTo(42L);
        assertThat(context.getUsername()).isEqualTo("alice");
        assertThat(context.getEmail()).isEqualTo("alice@example.com");
        assertThat(context.getRoles()).containsExactlyInAnyOrder("ROLE_ADMIN", "ROLE_USER");
    }
}

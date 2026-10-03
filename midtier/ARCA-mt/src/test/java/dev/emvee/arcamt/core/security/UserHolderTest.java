package dev.emvee.arcamt.core.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class UserHolderTest {

    @AfterEach
    void tearDown() {
        UserHolder.clear();
    }

    @Test
    void testSetAndGetUserContext() {
        UserContext context = UserContext.builder()
                .userId(100L)
                .username("john_doe")
                .email("john@example.com")
                .roles(List.of("ROLE_USER", "ROLE_ADMIN"))
                .build();

        UserHolder.set(context);

        assertThat(UserHolder.get()).isEqualTo(context);
        assertThat(UserHolder.getUserContext()).contains(context);
        assertThat(UserHolder.getUsername()).isEqualTo("john_doe");
        assertThat(UserHolder.getUserId()).isEqualTo(100L);
        assertThat(UserHolder.getEmail()).isEqualTo("john@example.com");
        assertThat(UserHolder.getRoles()).containsExactly("ROLE_USER", "ROLE_ADMIN");
        assertThat(UserHolder.hasRole("ROLE_ADMIN")).isTrue();
        assertThat(UserHolder.hasRole("ROLE_SUPERUSER")).isFalse();
    }

    @Test
    void testClearRemovesContext() {
        UserContext context = UserContext.builder()
                .userId(100L)
                .username("john_doe")
                .build();

        UserHolder.set(context);
        assertThat(UserHolder.getUserContext()).isPresent();

        UserHolder.clear();
        assertThat(UserHolder.get()).isNull();
        assertThat(UserHolder.getUserContext()).isEmpty();
        assertThat(UserHolder.getUsername()).isNull();
        assertThat(UserHolder.getUserId()).isNull();
        assertThat(UserHolder.getEmail()).isNull();
        assertThat(UserHolder.getRoles()).isEmpty();
    }
}

package dev.emvee.arcamt.auth.service;

import dev.emvee.arcamt.auth.model.dto.LoginRequest;
import dev.emvee.arcamt.auth.model.dto.UserDto;
import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.RefreshTokenRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.repository.model.RefreshToken;
import dev.emvee.arcamt.usermanagement.repository.UserRepository;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private LoginRepository loginRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private HashService hashService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authenticationService, "refreshTokenDurationMs", 86400000L);
    }

    @Test
    @DisplayName("login successfully returns UserDto with access and refresh tokens")
    void login_Success() {
        LoginRequest request = new LoginRequest("testuser", "password123");
        LoginInfo loginInfo = new LoginInfo(1L, "testuser", "hashedPassword");
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .roles(Set.of(Role.ROLE_USER))
                .build();

        when(loginRepository.findByUsername("testuser")).thenReturn(loginInfo);
        when(hashService.matches("password123", "hashedPassword")).thenReturn(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("access-token-xyz");
        when(refreshTokenRepository.findFirstByUser(user)).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> {
            RefreshToken token = invocation.getArgument(0);
            token.setId(10L);
            return token;
        });

        UserDto result = authenticationService.login(request);

        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo("testuser");
        assertThat(result.accessToken()).isEqualTo("access-token-xyz");
        assertThat(result.refreshToken()).isNotBlank();

        verify(refreshTokenRepository).findFirstByUser(user);
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("login replaces the existing refresh token row")
    void createRefreshToken_ReusesExistingToken() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .roles(Set.of(Role.ROLE_USER))
                .build();
        RefreshToken existingToken = RefreshToken.builder()
                .id(10L)
                .token("old-token")
                .expiryDate(Instant.now().minusSeconds(1))
                .user(user)
                .build();

        when(refreshTokenRepository.findFirstByUser(user)).thenReturn(Optional.of(existingToken));
        when(refreshTokenRepository.save(existingToken)).thenReturn(existingToken);

        RefreshToken result = authenticationService.createRefreshToken(user);

        assertThat(result).isSameAs(existingToken);
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getToken()).isNotEqualTo("old-token");
        assertThat(result.getExpiryDate()).isAfter(Instant.now());
        verify(refreshTokenRepository).save(existingToken);
    }

    @Test
    @DisplayName("login with invalid password throws RuntimeException")
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        LoginInfo loginInfo = new LoginInfo(1L, "testuser", "hashedPassword");

        when(loginRepository.findByUsername("testuser")).thenReturn(loginInfo);
        when(hashService.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        assertThatThrownBy(() -> authenticationService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid username or password");
    }

    @Test
    @DisplayName("refreshToken verifies expiration and returns refreshed tokens")
    void refreshToken_Success() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .roles(Set.of(Role.ROLE_USER))
                .build();
        RefreshToken refreshToken = RefreshToken.builder()
                .id(1L)
                .token("valid-token")
                .expiryDate(Instant.now().plusSeconds(3600))
                .user(user)
                .build();

        when(refreshTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(refreshToken));
        when(jwtService.generateToken(user)).thenReturn("new-access-token");

        UserDto result = authenticationService.refreshToken("valid-token");

        assertThat(result).isNotNull();
        assertThat(result.username()).isEqualTo("testuser");
        assertThat(result.accessToken()).isEqualTo("new-access-token");
        assertThat(result.refreshToken()).isEqualTo("valid-token");
    }

    @Test
    @DisplayName("refreshToken deletes expired token and throws RuntimeException")
    void refreshToken_Expired_ThrowsException() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .roles(Set.of(Role.ROLE_USER))
                .build();
        RefreshToken refreshToken = RefreshToken.builder()
                .id(1L)
                .token("expired-token")
                .expiryDate(Instant.now().minusSeconds(3600))
                .user(user)
                .build();

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> authenticationService.refreshToken("expired-token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Refresh token was expired. Please make a new signin request");

        verify(refreshTokenRepository).delete(refreshToken);
    }
}

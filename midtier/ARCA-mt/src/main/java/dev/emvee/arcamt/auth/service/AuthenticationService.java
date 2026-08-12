package dev.emvee.arcamt.auth.service;

import dev.emvee.arcamt.auth.model.dto.LoginRequest;
import dev.emvee.arcamt.auth.model.dto.UserDto;
import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.RefreshTokenRepository;
import dev.emvee.arcamt.usermanagement.repository.UserRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.repository.model.RefreshToken;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final LoginRepository loginRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final HashService hashService;

    @Value("${jwt.refreshExpiration}")
    private Long refreshTokenDurationMs;

    public UserDto login(LoginRequest requestBody) {
        LoginInfo loginInfo = loginRepository.findByUsername(requestBody.username());
        if (loginInfo == null || !hashService.matches(requestBody.password(), loginInfo.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        Optional<User> user = userRepository.findById(loginInfo.getId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        String accessToken = jwtService.generateToken(user.get());
        RefreshToken refreshToken = createRefreshToken(user.get());
        
        return UserDto.builder()
                .username(user.get().getUsername())
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    @Transactional
    public UserDto refreshToken(String requestRefreshToken) {
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return UserDto.builder()
                            .username(user.getUsername())
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user); // Revoke old tokens

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public String signup(@Valid LoginRequest loginRequest) {
        String hashedPassword = hashService.hash(loginRequest.password());
        LoginInfo loginInfo = new LoginInfo(null, loginRequest.username(), hashedPassword);
        LoginInfo result = loginRepository.save(loginInfo);
        
        User user = User.builder()
                .id(result.getId())
                .username(result.getUsername())
                .roles(Collections.singleton(Role.ROLE_USER))
                .build();
        userRepository.save(user);
        
        return result.getUsername();
    }
}

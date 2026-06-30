package dev.emvee.arcamt.auth.service;

import dev.emvee.arcamt.auth.model.LoginRequest;
import dev.emvee.arcamt.auth.repository.LoginRepository;
import dev.emvee.arcamt.auth.repository.UserRepository;
import dev.emvee.arcamt.auth.repository.model.LoginInfo;
import dev.emvee.arcamt.auth.repository.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final LoginRepository loginRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final HashService hashService;

    public String login(LoginRequest requestBody) {
        LoginInfo loginInfo = loginRepository.findByUsername(requestBody.username());
        if (!hashService.matches(requestBody.password(), loginInfo.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        Optional<User> user = userRepository.findById(loginInfo.getId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        else {
            return jwtService.generateToken(user.get());
        }
    }

    public String signup(@Valid LoginRequest loginRequest) {
        String hashedPassword = hashService.hash(loginRequest.password());
        LoginInfo loginInfo = new LoginInfo(null, loginRequest.username(), hashedPassword);
        LoginInfo result = loginRepository.save(loginInfo);
        userRepository.save(new User(result.getId(), result.getUsername()));
        return result.getUsername();
    }
}

package dev.emvee.arcamt.auth.service;

import dev.emvee.arcamt.core.security.UserContext;
import dev.emvee.arcamt.usermanagement.repository.model.Role;
import dev.emvee.arcamt.usermanagement.repository.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toList()));
        if (user.getId() != null) {
            claims.put("userId", user.getId());
        }
        if (user.getEmail() != null) {
            claims.put("email", user.getEmail());
        }

        return Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, Jwts.SIG.HS512)
                .compact();
    }

    public Claims getAllClaimsFromJwtToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public UserContext getUserContextFromJwtToken(String token) {
        Claims claims = getAllClaimsFromJwtToken(token);
        String username = claims.getSubject();
        List<String> roles = (List<String>) claims.get("roles");
        String email = claims.get("email", String.class);
        Object userIdObj = claims.get("userId");
        Long userId = null;
        if (userIdObj instanceof Number number) {
            userId = number.longValue();
        }

        return UserContext.builder()
                .userId(userId)
                .username(username)
                .email(email)
                .roles(roles != null ? roles : Collections.emptyList())
                .build();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public List<String> getRolesFromJwtToken(String token) {
        return (List<String>) Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("roles");
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}

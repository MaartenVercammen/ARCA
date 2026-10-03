package dev.emvee.arcamt.core.security;

import dev.emvee.arcamt.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new JwtAuthenticationFilter(jwtService);
        SecurityContextHolder.clearContext();
        UserHolder.clear();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
        UserHolder.clear();
    }

    @Test
    void doFilterInternal_WithValidToken_PopulatesUserHolderDuringChainAndCleansUpAfter()
            throws ServletException, IOException {
        String token = "valid.jwt.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateJwtToken(token)).thenReturn(true);

        UserContext expectedContext = UserContext.builder()
                .userId(1L)
                .username("testuser")
                .email("test@example.com")
                .roles(List.of("ROLE_USER"))
                .build();
        when(jwtService.getUserContextFromJwtToken(token)).thenReturn(expectedContext);

        AtomicReference<UserContext> contextDuringFilterChain = new AtomicReference<>();
        doAnswer(invocation -> {
            contextDuringFilterChain.set(UserHolder.get());
            return null;
        }).when(filterChain).doFilter(request, response);

        filter.doFilterInternal(request, response, filterChain);

        // Verify that during filter execution, UserHolder held the user context
        assertThat(contextDuringFilterChain.get()).isEqualTo(expectedContext);
        // Verify that after filter execution, UserHolder was cleared
        assertThat(UserHolder.get()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_WithoutAuthHeader_ContinuesChainWithoutSettingUser()
            throws ServletException, IOException {
        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(UserHolder.get()).isNull();
        verify(filterChain).doFilter(request, response);
    }
}

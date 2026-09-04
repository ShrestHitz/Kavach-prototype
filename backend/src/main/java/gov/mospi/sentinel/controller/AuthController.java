package gov.mospi.sentinel.controller;

import gov.mospi.sentinel.dto.request.LoginRequest;
import gov.mospi.sentinel.dto.response.LoginResponse;
import gov.mospi.sentinel.entity.User;
import gov.mospi.sentinel.repository.UserRepository;
import gov.mospi.sentinel.security.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication controller — login/logout/me.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Login, logout, and current user info")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Login with username/email and password")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsernameOrEmail(), request.getPassword()
            )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsernameOrEmail());
        User user = userRepository.findByUsername(userDetails.getUsername())
                .or(() -> userRepository.findByEmail(userDetails.getUsername()))
                .orElseThrow();

        // Update last login
        user.setLastLogin(OffsetDateTime.now());
        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().getName());
        claims.put("userId", user.getId());
        if (user.getState() != null) {
            claims.put("stateId", user.getState().getId());
        }

        String token = jwtUtil.generateToken(userDetails, claims);

        return ResponseEntity.ok(LoginResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().getName())
            .stateId(user.getState() != null ? user.getState().getId() : null)
            .stateName(user.getState() != null ? user.getState().getName() : null)
            .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<?> me(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(LoginResponse.builder()
            .userId(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().getName())
            .stateId(user.getState() != null ? user.getState().getId() : null)
            .stateName(user.getState() != null ? user.getState().getName() : null)
            .build());
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout (client-side token invalidation)")
    public ResponseEntity<Map<String, String>> logout() {
        // JWT is stateless — client discards the token
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

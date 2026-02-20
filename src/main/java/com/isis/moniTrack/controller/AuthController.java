package com.isis.moniTrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.isis.moniTrack.dto.request.LoginRequest;
import com.isis.moniTrack.dto.response.LoginResponse;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;
import com.isis.moniTrack.service.JwtService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final MonitorRepository monitorRepository;

  public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
      MonitorRepository monitorRepository) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.monitorRepository = monitorRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(),
            loginRequest.getPassword()));

    String role = authentication.getAuthorities().stream()
        .findFirst()
        .map(authority -> authority.getAuthority().replace("ROLE_", ""))
        .orElse("MONITOR");

    Monitor monitor = monitorRepository.findByEmail(authentication.getName());
    String name = monitor != null ? monitor.getName() : authentication.getName();

    String token = jwtService.generateToken(authentication.getName(), role, name);
    LoginResponse loginResponse = new LoginResponse(token);
    return ResponseEntity.ok(loginResponse);
  }
}

package com.isis.moniTrack.service;

import com.isis.moniTrack.dto.request.MonitorRequest;
import com.isis.moniTrack.dto.response.MonitorResponse;
import com.isis.moniTrack.mapper.MonitorMapper;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final MonitorMapper monitorMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MonitorResponse create(MonitorRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (monitorRepository.findByEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("A monitor with this email already exists: " + request.getEmail());
        }

        Monitor monitor = monitorMapper.toEntity(request);
        monitor.setPassword(passwordEncoder.encode(request.getPassword()));
        monitor.setRole(request.getRole());
     
        return monitorMapper.toResponse(monitorRepository.save(monitor));
    }
    
    @Transactional
    public List<MonitorResponse> getAll() {
        return monitorMapper.toListResponse(monitorRepository.findAll());
    }

}

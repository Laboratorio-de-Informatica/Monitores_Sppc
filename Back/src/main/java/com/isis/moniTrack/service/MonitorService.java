package com.isis.moniTrack.service;

import com.isis.moniTrack.dto.request.MonitorRequest;
import com.isis.moniTrack.dto.response.MonitorResponse;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MonitorService {

    @Autowired
    MonitorRepository monitorRepository;

    public MonitorService(MonitorRepository monitorRepository) {
        this.monitorRepository = monitorRepository;
    }

    public List<MonitorResponse> getAll() {
        return monitorRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MonitorResponse create(MonitorRequest request) {
        Monitor monitor = new Monitor();
        monitor.setEmail(request.getEmail());
        monitor.setName(request.getName());
     
        return toResponse(monitorRepository.save(monitor));
    }

    private MonitorResponse toResponse(Monitor monitor) {
        MonitorResponse dto = new MonitorResponse();
        dto.setEmail(monitor.getEmail());
        dto.setName(monitor.getName());
        return dto;
    }
}

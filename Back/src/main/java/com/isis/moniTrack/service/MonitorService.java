package com.isis.moniTrack.service;

import com.isis.moniTrack.dto.request.MonitorRequest;
import com.isis.moniTrack.dto.response.MonitorResponse;
import com.isis.moniTrack.mapper.MonitorMapper;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final MonitorMapper monitorMapper;

    public List<MonitorResponse> getAll() {
        return monitorMapper.toListResponse(monitorRepository.findAll());
    }

    public MonitorResponse create(MonitorRequest request) {
        Monitor monitor = monitorMapper.toEntity(request);
     
        return monitorMapper.toResponse(monitorRepository.save(monitor));
    }
}

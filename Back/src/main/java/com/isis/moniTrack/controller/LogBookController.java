package com.isis.moniTrack.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.isis.moniTrack.dto.request.LogBookRequest;
import com.isis.moniTrack.dto.request.StudentRequest;
import com.isis.moniTrack.dto.response.LogBookResponse;
import com.isis.moniTrack.model.LogBook;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.model.Student;
import com.isis.moniTrack.repository.LogBookRepository;
import com.isis.moniTrack.repository.MonitorRepository;
import com.isis.moniTrack.service.LogBookService;
import com.isis.moniTrack.service.StudentService;
import com.isis.moniTrack.mapper.LogBookMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/logbooks")
@RequiredArgsConstructor
public class LogBookController {

    private final LogBookService logBookService;
    private final LogBookRepository logBookRepository;
    private final MonitorRepository monitorRepository;
    private final StudentService studentService;
    private final LogBookMapper logBookMapper;

    @PostMapping
    public ResponseEntity<LogBookResponse> create(
            @RequestBody LogBookRequest request,
            Principal principal) {

        Long monitorId = resolveMonitorId(request.getMonitorId(), principal);
        request.setMonitorId(monitorId);

        if (request.getStartTime() == null) {
            request.setStartTime(LocalDateTime.now());
        }

        LogBookResponse created = logBookService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LogBookResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(logBookService.getLogBookById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody LogBookRequest request,
            Principal principal) {

        Long monitorId = resolveMonitorId(request.getMonitorId(), principal);
        request.setMonitorId(monitorId);

        logBookService.updateLogBook(id, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/students")
    @Transactional
    public ResponseEntity<LogBookResponse> addStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest studentReq) {

        LogBook logbook = logBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("LogBook no encontrado: " + id));

        List<Student> resolved = studentService.resolveForLogBook(List.of(studentReq));
        List<Student> current = logbook.getStudents();

        for (Student s : resolved) {
            if (current.stream().noneMatch(ex -> ex.getId().equals(s.getId()))) {
                current.add(s);
            }
        }

        logBookRepository.save(logbook);
        return ResponseEntity.ok(logBookMapper.toReponse(logbook));
    }

    @PutMapping("/{id}/finish")
    @Transactional
    public ResponseEntity<LogBookResponse> finish(@PathVariable Long id) {
        LogBook logbook = logBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("LogBook no encontrado: " + id));

        logbook.setEndTime(LocalDateTime.now());
        logBookRepository.save(logbook);
        return ResponseEntity.ok(logBookMapper.toReponse(logbook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logBookService.deleteLogBook(id);
        return ResponseEntity.noContent().build();
    }


    private Long resolveMonitorId(Long explicitId, Principal principal) {
        if (explicitId != null) {
            return explicitId;
        }
        Monitor monitor = monitorRepository.findByEmail(principal.getName());
        if (monitor == null) {
            throw new IllegalArgumentException("Monitor no encontrado para: " + principal.getName());
        }
        return monitor.getId();
    }
}

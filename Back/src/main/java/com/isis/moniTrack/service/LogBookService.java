package com.isis.moniTrack.service;


import java.util.List;

import org.springframework.stereotype.Service;
import com.isis.moniTrack.dto.request.LogBookRequest;
import com.isis.moniTrack.dto.response.LogBookResponse;
import com.isis.moniTrack.exception.LogBookNotFoundException;
import com.isis.moniTrack.mapper.LogBookMapper;
import com.isis.moniTrack.model.LogBook;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.model.Student;
import com.isis.moniTrack.repository.LogBookRepository;
import com.isis.moniTrack.repository.MonitorRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogBookService {

    private final LogBookRepository logBookRepository;
    private final MonitorRepository monitorRepository;
    private final StudentService studentService;
    private final LogBookMapper logBookMapper;

    @Transactional
    public LogBookResponse create(LogBookRequest request) {
        Monitor monitor = monitorRepository.findById(request.getMonitorId())
            .orElseThrow(() -> new IllegalArgumentException("Monitor no existe: " + request.getMonitorId()));

        List<Student> resolved = studentService.resolveForLogBook(request.getStudents());

        LogBook logbook = LogBook.builder()
            .name(request.getName())
            .course(request.getCourse())
            .topic(request.getTopic())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .monitor(monitor)
            .students(resolved)
            .build();

        LogBook saved = logBookRepository.save(logbook);
        return logBookMapper.toReponse(saved);
    }

    @Transactional
    public void updateLogBook(Long id, LogBookRequest request) {

        LogBook logbook = logBookRepository.findById(id)
            .orElseThrow(() -> new LogBookNotFoundException("Log Book with id: " + id));

        Monitor monitor = monitorRepository.findById(request.getMonitorId())
            .orElseThrow(() -> new IllegalArgumentException("Monitor no existe: " + request.getMonitorId()));

        List<Student> resolved = studentService.resolveForLogBook(request.getStudents());

        logbook.setName(request.getName());
        logbook.setCourse(request.getCourse());
        logbook.setTopic(request.getTopic());
        logbook.setStartTime(request.getStartTime());
        logbook.setEndTime(request.getEndTime());
        logbook.setMonitor(monitor);
        logbook.setStudents(resolved);
        logBookRepository.save(logbook);

    }

    @Transactional
    public void deleteLogBook(Long id) {
        if (!logBookRepository.existsById(id)) {
            throw new LogBookNotFoundException("Log book not found to delete: " + id);
        }
        logBookRepository.deleteById(id);

    }

    @Transactional
    public LogBookResponse getLogBookById(Long id) {

        LogBook logbook = logBookRepository.findById(id)
            .orElseThrow(() -> new LogBookNotFoundException("LogBook not found with id: " + id));

        return logBookMapper.toReponse(logbook);


    }

}
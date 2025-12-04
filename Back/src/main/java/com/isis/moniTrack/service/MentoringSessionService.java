package com.isis.moniTrack.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.isis.moniTrack.dto.request.MentoringSessionRequest;
import com.isis.moniTrack.dto.request.StudentRequest;
import com.isis.moniTrack.dto.response.MentoringSessionDTO;
import com.isis.moniTrack.model.MentoringSession;
import com.isis.moniTrack.model.MentoringSessionStudent;
import com.isis.moniTrack.model.MentoringSessionStudentId;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.model.Student;
import com.isis.moniTrack.repository.MentoringSessionRepository;
import com.isis.moniTrack.repository.MentoringSessionStudentRepository;
import com.isis.moniTrack.repository.MonitorRepository;
import com.isis.moniTrack.repository.StudentRepository;
import org.springframework.security.core.Authentication;

import jakarta.transaction.Transactional;

@Service
public class MentoringSessionService {
    @Autowired
    MonitorRepository monitorRepository;
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    MentoringSessionRepository sessionRepository;
    @Autowired
    MentoringSessionStudentRepository mentoringSessionStudentRepository;

    public MentoringSessionDTO createSession(MentoringSessionRequest request) {
        MentoringSession session;
        MentoringSessionDTO dto;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        session = new MentoringSession();
        session.setStartTime(java.time.LocalDateTime.now()); // <-- guarda fecha y hora exacta
        session.setTopic(request.getTopic());
        Monitor monitor = monitorRepository.findByEmail(auth.getName());
        if (monitor == null) {
            throw new IllegalArgumentException("Monitor not found");
        }
        session.setMonitor(monitor); // <--- ASIGNA EL MONITOR ANTES DE GUARDAR

        sessionRepository.save(session);

        dto = new MentoringSessionDTO();
        dto.setId(session.getId());
        dto.setStartTime(session.getStartTime());
        dto.setTopic(session.getTopic());
        dto.setEmailMonitor(monitor.getEmail());
        dto.setStudentIds(List.of());
        return dto;
    }

    @Transactional
    public MentoringSessionDTO addStudentToSession(StudentRequest studentRequest) {
        // validaciones básicas
        if (studentRequest == null || studentRequest.getSessionId() == null || studentRequest.getId() == null) {
            throw new IllegalArgumentException("sessionId and student id are required");
        }

        // cargar sesión
        MentoringSession session = sessionRepository.findById(studentRequest.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        // evitar agregar a sesiones futuras
        if (session.getStartTime() != null && session.getStartTime().isAfter(java.time.LocalDateTime.now())) {
            throw new IllegalStateException("Cannot add students to future sessions");
        }

        // obtener o crear estudiante
        Long studentId = studentRequest.getId();
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            student = new Student();
            student.setId(studentId);
            student.setName(studentRequest.getName());
            student = studentRepository.save(student);
        }

        // construir id compuesto
        MentoringSessionStudentId id = new MentoringSessionStudentId();
        id.setSessionId(session.getId());
        id.setStudentId(student.getId());

        // evitar duplicados
        boolean alreadyExists = mentoringSessionStudentRepository.existsById(id);
        if (alreadyExists) {
            throw new IllegalStateException("Student is already registered in this session");
        }

        // crear relación y guardar
        MentoringSessionStudent relation = new MentoringSessionStudent();
        relation.setId(id);
        relation.setSession(session);
        relation.setStudent(student);
        relation.setCheckInTime(java.time.LocalTime.now());

        mentoringSessionStudentRepository.save(relation);

        // (opcional) si quieres que la sesión en memoria refleje la relación sin volver a consultar:
        // if (session.getSessionStudents() != null) session.getSessionStudents().add(relation);
        MentoringSessionDTO dto = new MentoringSessionDTO();
        dto.setId(session.getId());
        dto.setStartTime(session.getStartTime());
        dto.setTopic(session.getTopic());
        dto.setEmailMonitor(session.getMonitor().getEmail());
        List<MentoringSessionStudent> relations = mentoringSessionStudentRepository.findBySessionId(session.getId());
        List<Long> studentIds = relations.stream()
                .map(rel -> rel.getStudent().getId())
                .toList();
        dto.setStudentIds(studentIds);
        return dto;
    
    }

    public List<MentoringSessionDTO> getAllSessions() {
        List<MentoringSession> sessions = sessionRepository.findAll();
        List<MentoringSessionDTO> dtos = sessions.stream().map(session -> {
            MentoringSessionDTO dto = new MentoringSessionDTO();
            dto.setId(session.getId());
            dto.setStartTime(session.getStartTime());
            dto.setTopic(session.getTopic());
            dto.setEmailMonitor(session.getMonitor().getEmail());
            List<MentoringSessionStudent> relations = mentoringSessionStudentRepository.findBySessionId(session.getId());
            List<Long> studentIds = relations.stream()
                    .map(rel -> rel.getStudent().getId())
                    .toList();
            dto.setStudentIds(studentIds);
            return dto;
        }).toList();
        return dtos;
    }

    public Optional<MentoringSession> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }


    @Transactional
    public MentoringSessionDTO updateBitacora(Long sessionId, String bitacoraText) {
        MentoringSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        session.setNotes(bitacoraText);
        sessionRepository.save(session);

        MentoringSessionDTO dto = new MentoringSessionDTO();
        dto.setId(session.getId());
        dto.setStartTime(session.getStartTime());
        dto.setTopic(session.getTopic());
        dto.setEmailMonitor(session.getMonitor().getEmail());
        dto.setStudentIds(
            mentoringSessionStudentRepository.findBySessionId(session.getId())
                .stream().map(rel -> rel.getStudent().getId()).toList()
        );
        return dto;
    }

    public MentoringSessionDTO finishSession(Long sessionId) {
        MentoringSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        // Lógica para finalizar la sesión (por ejemplo, actualizar el estado)
        session.setEndTime(java.time.LocalDateTime.now());
        sessionRepository.save(session);

        MentoringSessionDTO dto = new MentoringSessionDTO();
        dto.setId(session.getId());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setTopic(session.getTopic());
        dto.setEmailMonitor(session.getMonitor().getEmail());
        dto.setStudentIds(
            mentoringSessionStudentRepository.findBySessionId(session.getId())
                .stream().map(rel -> rel.getStudent().getId()).toList()
        );

        return dto;
    }
}

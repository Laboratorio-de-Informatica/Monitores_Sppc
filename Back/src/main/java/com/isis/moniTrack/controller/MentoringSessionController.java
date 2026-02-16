package com.isis.moniTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isis.moniTrack.dto.request.MentoringSessionRequest;
import com.isis.moniTrack.dto.request.StudentRequest;
import com.isis.moniTrack.dto.response.MentoringSessionDTO;
import com.isis.moniTrack.model.MentoringSession;
import com.isis.moniTrack.service.MentoringSessionService;

@RestController
@RequestMapping("/api/v1/mentoring-sessions")
public class MentoringSessionController {
    
    @Autowired
    MentoringSessionService mentoringSessionService;


    // Crear una nueva sesión
    @PostMapping
    @RequestMapping("/create")
    public ResponseEntity<MentoringSessionDTO> createSession(@RequestBody MentoringSessionRequest request) {
        return ResponseEntity.ok(mentoringSessionService.createSession(request));
    }

    // Añadir un estudiante a una sesión
    @PostMapping
    @RequestMapping("/add-student")
    public ResponseEntity<MentoringSessionDTO> addStudent(@RequestBody StudentRequest student) {

        return ResponseEntity.status(HttpStatus.CREATED).body(mentoringSessionService.addStudentToSession(student));

    }

    @PutMapping("/{sessionId}/finish")
    public ResponseEntity<MentoringSessionDTO> finishSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(mentoringSessionService.finishSession(sessionId));
    }

    // Actualizar la bitácora de una sesión
    @PutMapping("/{sessionId}/bitacora")
    public ResponseEntity<MentoringSessionDTO> updateBitacora(
            @PathVariable Long sessionId,
            @RequestBody String bitacoraText) {
        MentoringSessionDTO dto = mentoringSessionService.updateBitacora(sessionId, bitacoraText);
        return ResponseEntity.ok(dto);
    }
    

    // Listar todas las sesiones
    @GetMapping
    public ResponseEntity<List<MentoringSessionDTO>> getAllSessions() {
        return ResponseEntity.ok(mentoringSessionService.getAllSessions());
    }

    // Consultar una sesión por ID
    @GetMapping("/{id}")
    public ResponseEntity<MentoringSession> getSessionById(@PathVariable Long id) {
        return mentoringSessionService.getSessionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

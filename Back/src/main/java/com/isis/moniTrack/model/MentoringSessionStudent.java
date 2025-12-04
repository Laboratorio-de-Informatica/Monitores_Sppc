package com.isis.moniTrack.model;

import java.time.LocalTime;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class MentoringSessionStudent {

    @EmbeddedId
    private MentoringSessionStudentId id;

    @ManyToOne
    @MapsId("sessionId") 
    private MentoringSession session;

    @ManyToOne
    @MapsId("studentId")
    private Student student;

    // Campos extra opcionales
    private LocalTime checkInTime;
}

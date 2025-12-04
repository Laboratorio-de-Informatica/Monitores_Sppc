package com.isis.moniTrack.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class MentoringSessionStudentId implements Serializable {
    private Long sessionId;
    private Long studentId;

}


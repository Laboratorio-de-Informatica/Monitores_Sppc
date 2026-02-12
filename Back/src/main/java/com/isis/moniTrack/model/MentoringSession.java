package com.isis.moniTrack.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MentoringSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;
   
    @Column(name = "start_time")
    private LocalDateTime startTime; // <-- nuevo campo para fecha y hora de inicio

    @Column(name = "end_time")
    private LocalDateTime endTime; // <-- nuevo campo para fecha y hora de fin
    
    @ManyToOne
    @JoinColumn(name = "monitor_id")
    private Monitor monitor;
    
    @OneToMany(mappedBy = "session")
    private List<MentoringSessionStudent> sessionStudents;

    private String notes;
}

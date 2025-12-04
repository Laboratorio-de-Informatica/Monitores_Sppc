package com.isis.moniTrack.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Student {
    
    @Id
    private Long id;
    private String name;
    private String program;

    @OneToMany(mappedBy = "student")
    private List<MentoringSessionStudent> sessionStudents;
}

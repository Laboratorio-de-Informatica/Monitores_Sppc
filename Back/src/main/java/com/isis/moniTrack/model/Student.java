package com.isis.moniTrack.model;

import java.util.List;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;


import com.isis.moniTrack.model.enums.Role;

@Entity
@Table(name="students")
@Getter
@Setter
public class Student {
    
    @Id
    private Long id; // Carnet Estudiante 
    private String name; 
    private String program; // Programa academico 
    private Role role; // Student deberia ser role
    
    @ManyToOne
    private LogBook logbook;

}

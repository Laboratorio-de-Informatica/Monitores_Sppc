package com.isis.moniTrack.model;

import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.isis.moniTrack.model.enums.Role;

@Entity
@Table(name = "students")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {

  @Id
  private Long id; // Carnet Estudiante
  private String name;
  private String program; // Programa academico
  @Enumerated(EnumType.STRING)
  private Role role; // Student deberia ser role

  @ManyToOne
  private Monitor monitor;

  @ManyToMany(mappedBy = "students")
  private List<LogBook> logbooks;
}

package com.isis.moniTrack.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "logbooks")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogBook {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String course;

  private String topic;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  @ManyToOne
  private Monitor monitor;

  @ManyToMany
  @JoinTable(name = "logbook_student", joinColumns = @JoinColumn(name = "logbook_id"), inverseJoinColumns = @JoinColumn(name = "student_id"))
  private List<Student> students;

}

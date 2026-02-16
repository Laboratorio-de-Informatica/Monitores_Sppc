package com.isis.moniTrack.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;




@Entity
@Table(name = "logbooks")
@Builder
@Getter
@Setter
public class LogBook {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) 
  private Long id;

  private String name;

  private String course;

  private String topic;

  private LocalDateTime startTime;

  private LocalDateTIme endTime;
  
  @ManyToOne
  private Monitor monitor;

  @OneToMany(mappedBy= "logbook")
  private List<Student> students;

}

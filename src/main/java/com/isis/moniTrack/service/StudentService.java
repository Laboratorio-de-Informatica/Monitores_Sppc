package com.isis.moniTrack.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.isis.moniTrack.dto.request.StudentRequest;
import com.isis.moniTrack.model.Student;
import com.isis.moniTrack.model.enums.Role;
import com.isis.moniTrack.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

  private final StudentRepository studentRepository;

  public List<Student> resolveForLogBook(List<StudentRequest> studentsRequest) {
    List<Student> resolved = new ArrayList<>();
    if (studentsRequest == null || studentsRequest.isEmpty()) {
      return resolved;
    }

    for (StudentRequest s : studentsRequest) {
      if (s.getId() == null) {
        throw new IllegalArgumentException("Cada estudiante debe incluir id (carnet)");
      }

      Student student = studentRepository.findById(s.getId()).orElseGet(() -> Student.builder()
          .id(s.getId())
          .name(s.getName())
          .program(s.getProgram())
          .role(Role.STUDENT)
          .build());

      if (student.getName() == null || student.getName().isBlank()) {
        student.setName(s.getName());
      }
      if (student.getProgram() == null || student.getProgram().isBlank()) {
        student.setProgram(s.getProgram());
      }
      if (student.getRole() == null) {
        student.setRole(Role.STUDENT);
      }

      resolved.add(studentRepository.save(student));
    }

    return resolved;
  }
}

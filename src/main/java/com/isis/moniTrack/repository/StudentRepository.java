package com.isis.moniTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.isis.moniTrack.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}

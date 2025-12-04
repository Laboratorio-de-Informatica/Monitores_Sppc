package com.isis.moniTrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isis.moniTrack.model.MentoringSessionStudent;
import com.isis.moniTrack.model.MentoringSessionStudentId;
import com.isis.moniTrack.model.Monitor;

public interface MentoringSessionStudentRepository extends JpaRepository<MentoringSessionStudent, MentoringSessionStudentId> {

List<MentoringSessionStudent> findBySessionId(Long sessionId);    
}

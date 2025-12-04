package com.isis.moniTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isis.moniTrack.model.MentoringSession;

public interface MentoringSessionRepository extends JpaRepository<MentoringSession, Long> {

    
} 

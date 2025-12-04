package com.isis.moniTrack.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.isis.moniTrack.model.Monitor;

public interface MonitorRepository extends JpaRepository<Monitor, Long> {

    Monitor findByEmail(String email);
    
} 
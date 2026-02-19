package com.isis.moniTrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.isis.moniTrack.model.LogBook;

public interface LogBookRepository extends JpaRepository<LogBook, Long> {

}

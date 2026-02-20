package com.isis.moniTrack.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.isis.moniTrack.model.LogBook;

public interface LogBookRepository extends JpaRepository<LogBook, Long> {
    List<LogBook> findByMonitorIdOrderByStartTimeDesc(Long monitorId);
    List<LogBook> findAllByOrderByStartTimeDesc();
}

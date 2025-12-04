package com.isis.moniTrack.service;

import com.isis.moniTrack.dto.response.InsightOverviewDTO;
import com.isis.moniTrack.repository.InsightRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InsightService {

    private final InsightRepository repo;

    public InsightService(InsightRepository repo) {
        this.repo = repo;
    }

    public InsightOverviewDTO getOverview() {
        // Calcular inicio de semana (lunes)
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDateTime startOfWeekDateTime = startOfWeek.atStartOfDay();

        Double avgDuration = repo.avgSessionDurationMinutes();
        long sessionsThisWeek = repo.countSessionsThisWeek(startOfWeekDateTime);
        String topMonitor = repo.topMonitorName();
        long topMonitorSessions = topMonitor != null ? repo.topMonitorSessions(topMonitor) : 0;
        double avgStudents = repo.avgStudentsPerSession() == null ? 0.0 : repo.avgStudentsPerSession();

        return new InsightOverviewDTO(
            avgDuration == null ? 0.0 : avgDuration,
            sessionsThisWeek,
            topMonitor == null ? "" : topMonitor,
            topMonitorSessions,
            avgStudents
        );
    }

    public Map<String, Long> getSessionsPerMonitor() {
        List<Object[]> rows = repo.sessionsPerMonitor();
        return rows.stream().collect(Collectors.toMap(r -> (String) r[0], r -> ((Number) r[1]).longValue()));
    }

    public Map<String, Long> getTopicDistribution() {
        List<Object[]> rows = repo.topicDistribution();
        return rows.stream().collect(Collectors.toMap(r -> (String) r[0], r -> ((Number) r[1]).longValue()));
    }

    public List<Object[]> getTrend(LocalDateTime from, LocalDateTime to) {
        java.sql.Timestamp t1 = java.sql.Timestamp.valueOf(from);
        java.sql.Timestamp t2 = java.sql.Timestamp.valueOf(to);
        return repo.sessionsPerDay(t1, t2);
    }
}

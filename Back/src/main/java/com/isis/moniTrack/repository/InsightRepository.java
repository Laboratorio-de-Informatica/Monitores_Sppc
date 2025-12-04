package com.isis.moniTrack.repository;

import com.isis.moniTrack.model.MentoringSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.util.List;

@Repository
public interface InsightRepository extends JpaRepository<MentoringSession, Long> {

    @Query("SELECT COUNT(s) FROM MentoringSession s")
    long countAllSessions();

    // Usar JPQL con el campo 'startTime' de la entidad
    @Query("SELECT COUNT(s) FROM MentoringSession s WHERE s.startTime >= :start")
    long countSessionsSince(LocalDateTime start);

    @Query("SELECT COUNT(DISTINCT s.monitor.id) FROM MentoringSession s")
    long countDistinctMonitors();

    // promedio tamaño de la colección sessionStudents
    @Query("SELECT AVG(size(s.sessionStudents)) FROM MentoringSession s")
    Double avgStudentsPerSession();

    // no hay duración en la entidad; dejar nulo si no existe
    @Query("SELECT NULL")
    Double avgDurationMinutes();

    @Query("SELECT s.monitor.name, COUNT(s) FROM MentoringSession s GROUP BY s.monitor.name")
    List<Object[]> sessionsPerMonitor();

    @Query("SELECT s.topic, COUNT(s) FROM MentoringSession s GROUP BY s.topic")
    List<Object[]> topicDistribution();

    // Query nativa sobre la columna start_time (ajusta si tu bd usa otro nombre)
    @Query(value =
        "SELECT CAST(s.start_time AS DATE) as day, COUNT(*) FROM mentoring_session s " +
        "WHERE s.start_time BETWEEN :from AND :to GROUP BY day ORDER BY day", nativeQuery = true)
    List<Object[]> sessionsPerDay(Timestamp from, Timestamp to);

    // Promedio de duración en minutos
    @Query("SELECT AVG(TIMESTAMPDIFF(MINUTE, s.startTime, s.endTime)) FROM MentoringSession s WHERE s.endTime IS NOT NULL")
    Double avgSessionDurationMinutes();

    // Sesiones creadas en la semana actual
    @Query("SELECT COUNT(s) FROM MentoringSession s WHERE s.startTime >= :startOfWeek")
    long countSessionsThisWeek(LocalDateTime startOfWeek);

    // Monitor con más sesiones
    @Query("SELECT s.monitor.name FROM MentoringSession s GROUP BY s.monitor.name ORDER BY COUNT(s) DESC LIMIT 1")
    String topMonitorName();

    @Query("SELECT COUNT(s) FROM MentoringSession s WHERE s.monitor.name = :monitorName")
    long topMonitorSessions(String monitorName);
}

package com.isis.moniTrack.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.isis.moniTrack.dto.response.SessionStudentsStatisticResponse;
import com.isis.moniTrack.dto.response.StudentResponse;
import com.isis.moniTrack.dto.response.TopMonitorStatisticResponse;
import com.isis.moniTrack.mapper.StudentMapper;
import com.isis.moniTrack.model.LogBook;
import com.isis.moniTrack.repository.LogBookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final LogBookRepository logBookRepository;
    private final StudentMapper studentMapper;

    public double getAverageDurationPerSessionMinutes() {
        List<LogBook> sessions = logBookRepository.findAll();

        List<Long> durations = sessions.stream()
            .filter(s -> s.getStartTime() != null && s.getEndTime() != null)
            .map(s -> Duration.between(s.getStartTime(), s.getEndTime()).toMinutes())
            .filter(minutes -> minutes >= 0)
            .toList();

        if (durations.isEmpty()) {
            return 0.0;
        }

        return durations.stream().mapToLong(Long::longValue).average().orElse(0.0);
    }

    public Map<String, Long> getSessionsPerWeek() {
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        Map<String, Long> grouped = logBookRepository.findAll().stream()
            .filter(s -> s.getStartTime() != null)
            .collect(Collectors.groupingBy(
                s -> toWeekKey(s.getStartTime().toLocalDate(), weekFields),
                Collectors.counting()
            ));

        return grouped.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (a, b) -> a,
                LinkedHashMap::new
            ));
    }

    public TopMonitorStatisticResponse getTopMonitorWithMostSessions() {
        Map<String, Long> byMonitor = logBookRepository.findAll().stream()
            .filter(s -> s.getMonitor() != null)
            .collect(Collectors.groupingBy(s -> s.getMonitor().getName(), Collectors.counting()));

        return byMonitor.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(entry -> TopMonitorStatisticResponse.builder()
                .monitorName(entry.getKey())
                .sessions(entry.getValue())
                .build())
            .orElse(TopMonitorStatisticResponse.builder()
                .monitorName("")
                .sessions(0L)
                .build());
    }

    public List<SessionStudentsStatisticResponse> getStudentsBySession() {
        List<LogBook> sessions = logBookRepository.findAll();
        sessions.sort(Comparator.comparing(LogBook::getId));

        List<SessionStudentsStatisticResponse> result = new ArrayList<>();
        for (LogBook session : sessions) {
            List<StudentResponse> students = session.getStudents() == null
                ? List.of()
                : session.getStudents().stream().map(studentMapper::toResponse).toList();

            result.add(SessionStudentsStatisticResponse.builder()
                .sessionId(session.getId())
                .sessionName(session.getName())
                .students(students)
                .build());
        }

        return result;
    }

    private String toWeekKey(LocalDate date, WeekFields weekFields) {
        int weekYear = date.get(weekFields.weekBasedYear());
        int week = date.get(weekFields.weekOfWeekBasedYear());
        return String.format("%d-W%02d", weekYear, week);
    }
}
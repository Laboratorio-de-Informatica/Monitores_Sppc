package com.isis.moniTrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isis.moniTrack.dto.response.SessionStudentsStatisticResponse;
import com.isis.moniTrack.dto.response.TopMonitorStatisticResponse;
import com.isis.moniTrack.service.StatisticService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/statistics")
@RequiredArgsConstructor
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping("/average-duration")
    public double averageDurationPerSession() {
        return statisticService.getAverageDurationPerSessionMinutes();
    }

    @GetMapping("/sessions-per-week")
    public Map<String, Long> sessionsPerWeek() {
        return statisticService.getSessionsPerWeek();
    }

    @GetMapping("/top-monitor")
    public TopMonitorStatisticResponse topMonitor() {
        return statisticService.getTopMonitorWithMostSessions();
    }

    @GetMapping("/students-by-session")
    public List<SessionStudentsStatisticResponse> studentsBySession() {
        return statisticService.getStudentsBySession();
    }
}
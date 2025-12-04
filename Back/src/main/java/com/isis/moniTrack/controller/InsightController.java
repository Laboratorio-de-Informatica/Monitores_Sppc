package com.isis.moniTrack.controller;

import com.isis.moniTrack.dto.response.InsightOverviewDTO;
import com.isis.moniTrack.service.InsightService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/insights")
public class InsightController {

    private final InsightService service;

    public InsightController(InsightService service) {
        this.service = service;
    }

    @GetMapping("/overview")
    public InsightOverviewDTO overview() {
        return service.getOverview();
    }

    @GetMapping("/by-monitor")
    public Map<String, Long> byMonitor() {
        return service.getSessionsPerMonitor();
    }

    @GetMapping("/topics")
    public Map<String, Long> topics() {
        return service.getTopicDistribution();
    }

    @GetMapping("/trend")
    public List<Object[]> trend(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return service.getTrend(from, to);
    }
}

package com.isis.moniTrack.dto.response;

public class InsightOverviewDTO {
    private double avgSessionDurationMinutes;
    private long sessionsThisWeek;
    private String topMonitorName;
    private long topMonitorSessions;
    private double avgStudentsPerSession;

    public InsightOverviewDTO() {}

    public InsightOverviewDTO(double avgSessionDurationMinutes, long sessionsThisWeek, String topMonitorName, long topMonitorSessions, double avgStudentsPerSession) {
        this.avgSessionDurationMinutes = avgSessionDurationMinutes;
        this.sessionsThisWeek = sessionsThisWeek;
        this.topMonitorName = topMonitorName;
        this.topMonitorSessions = topMonitorSessions;
        this.avgStudentsPerSession = avgStudentsPerSession;
    }

    public double getAvgSessionDurationMinutes() { return avgSessionDurationMinutes; }
    public void setAvgSessionDurationMinutes(double avgSessionDurationMinutes) { this.avgSessionDurationMinutes = avgSessionDurationMinutes; }
    public long getSessionsThisWeek() { return sessionsThisWeek; }
    public void setSessionsThisWeek(long sessionsThisWeek) { this.sessionsThisWeek = sessionsThisWeek; }
    public String getTopMonitorName() { return topMonitorName; }
    public void setTopMonitorName(String topMonitorName) { this.topMonitorName = topMonitorName; }
    public long getTopMonitorSessions() { return topMonitorSessions; }
    public void setTopMonitorSessions(long topMonitorSessions) { this.topMonitorSessions = topMonitorSessions; }
    public double getAvgStudentsPerSession() { return avgStudentsPerSession; }
    public void setAvgStudentsPerSession(double avgStudentsPerSession) { this.avgStudentsPerSession = avgStudentsPerSession; }
}

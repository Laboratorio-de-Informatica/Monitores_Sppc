package com.isis.moniTrack.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MentoringSessionDTO {
    private Long id;
    private String topic;
    private LocalDateTime startTime;
    private String emailMonitor;
    private List<Long> studentIds; // relación indirecta
    private LocalDateTime endTime;
}

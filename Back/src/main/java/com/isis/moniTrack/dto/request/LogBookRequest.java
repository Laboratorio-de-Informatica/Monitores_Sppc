package com.isis.moniTrack.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LogBookRequest {

    private Long id;

    private String name;

    private String course;

    private String topic;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long monitorId;

    private List<StudentRequest> students;

}

package com.isis.moniTrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopMonitorStatisticResponse {

    private String monitorName;
    private Long sessions;
}
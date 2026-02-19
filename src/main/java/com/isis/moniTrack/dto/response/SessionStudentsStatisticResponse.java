package com.isis.moniTrack.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionStudentsStatisticResponse {

    private Long sessionId;
    private String sessionName;
    private List<StudentResponse> students;
}
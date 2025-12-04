package com.isis.moniTrack.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {

    private Long sessionId;
    private Long id;
    private String name;

    
}

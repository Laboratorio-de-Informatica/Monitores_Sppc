package com.isis.moniTrack.dto.request;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String email;
    
    private String password;
    
    private LocalDateTime loginTime;
}
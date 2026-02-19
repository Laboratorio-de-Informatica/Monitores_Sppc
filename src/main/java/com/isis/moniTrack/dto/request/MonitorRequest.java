package com.isis.moniTrack.dto.request;

import com.isis.moniTrack.model.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MonitorRequest {
    
    private Long id;

    private String email;

    private String name;

    private String password;

    private Role role;
}

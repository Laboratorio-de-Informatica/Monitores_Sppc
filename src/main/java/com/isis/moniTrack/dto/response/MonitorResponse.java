package com.isis.moniTrack.dto.response;


import com.isis.moniTrack.model.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonitorResponse {

    private Long id;

    private String email;

    private String name;

    private Role role;
}
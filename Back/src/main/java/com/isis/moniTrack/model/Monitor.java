package com.isis.moniTrack.model;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Monitor {

    @Id
    private String email;
    private String name;
    private String password;
    private String role; // e.g., "ROLE_ADMIN", "ROLE_MONITOR"  
    
    @OneToMany(mappedBy = "monitor")
    private List<MentoringSession> sessions;
    
}

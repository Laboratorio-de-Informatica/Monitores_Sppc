package com.isis.moniTrack.security;

import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MonitorDetailsService implements UserDetailsService {

    @Autowired
    private MonitorRepository monitorRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Monitor monitor = monitorRepository.findByEmail(email);
        if (monitor == null) {
            throw new UsernameNotFoundException("Monitor no encontrado: " + email);
        }

        return User.builder()
                .username(monitor.getEmail())
                .password(monitor.getPassword()) // debe estar encriptada con BCrypt
                .roles(monitor.getRole()) 
                .build();
    }
}

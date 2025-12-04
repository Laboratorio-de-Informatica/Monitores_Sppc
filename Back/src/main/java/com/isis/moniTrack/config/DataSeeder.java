package com.isis.moniTrack.config;

import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(MonitorRepository monitorRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verifica si ya existe un admin para no duplicarlo
            if (monitorRepository.findByEmail("admin@uni.edu") == null) {
                Monitor admin = new Monitor();
                admin.setName("Admin");
                admin.setEmail("admin@uni.edu");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN"); 
                monitorRepository.save(admin);

                System.out.println(" Usuario admin sembrado: admin@uni.edu / admin123");
            } else {
                System.out.println("ℹ Usuario admin ya existe, no se volvió a crear.");
            }
        };
    }
}

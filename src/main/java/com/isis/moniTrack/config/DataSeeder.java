package com.isis.moniTrack.config;

import com.isis.moniTrack.model.enums.Role;
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
      Monitor admin = monitorRepository.findByEmail("admin@uni.edu");
      if (admin == null) {
        admin = new Monitor();
        admin.setId(1L);
        admin.setName("Admin");
        admin.setEmail("admin@uni.edu");
      }
      admin.setPassword(passwordEncoder.encode("admin123"));
      admin.setRole(Role.ADMIN);
      monitorRepository.save(admin);

      System.out.println(" Usuario admin sembrado/actualizado: admin@uni.edu / admin123");
    };
  }
}

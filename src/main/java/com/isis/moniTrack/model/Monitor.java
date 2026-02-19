package com.isis.moniTrack.model;

import com.isis.moniTrack.model.enums.Role;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "monitors")
public class Monitor {

  @Id
  private Long id;
  private String email;
  private String name;
  private String password;
  @Enumerated(EnumType.STRING)
  private Role role;
  private LocalDateTime createdAt;
  private LocalDateTime updateAt;
  @OneToMany(mappedBy = "monitor")
  private List<LogBook> sessions;

}

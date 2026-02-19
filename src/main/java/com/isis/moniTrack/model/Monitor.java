package com.isis.moniTrack.model;

import com.isis.moniTrack.model.enums.Role;

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
  private Role role; // e.g., "ROLE_ADMIN", "ROLE_MONITOR" -> Esto inicialmente estaba definido como

  @OneToMany(mappedBy = "monitor")
  private List<LogBook> sessions;
  // Es necesario definir una entidad estudiante? de igual forma tiene que ser
  // relacional la base de datos?
  // Podria ser noSQL y no me interesan los duplicados de igual forma solo seria
  // una estructura mas ligera.

}

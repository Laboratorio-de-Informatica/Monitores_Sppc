package com.isis.moniTrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PathVariable;
import com.isis.moniTrack.dto.request.MonitorRequest;
import com.isis.moniTrack.dto.response.BulkUploadResult;
import com.isis.moniTrack.dto.response.MonitorResponse;
import com.isis.moniTrack.service.MonitorBulkService;
import com.isis.moniTrack.service.MonitorService;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/monitors")
public class MonitorController {

  @Autowired
  MonitorService monitorService;

  @Autowired
  MonitorBulkService bulkService;

  /**
   * POST /api/v1/monitors/upload
   * Form-data: file (xlsx), overwrite (optional boolean)
   */
  @PostMapping("/upload")
  @PreAuthorize("hasRole('ADMIN')") // Solo usuarios con rol ADMIN pueden acceder
  public ResponseEntity<BulkUploadResult> uploadExcel(
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "overwrite", defaultValue = "false") boolean overwrite) {
    BulkUploadResult result = bulkService.importFromExcel(file);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @GetMapping
  public ResponseEntity<List<MonitorResponse>> getAll() {
    return ResponseEntity.ok(monitorService.getAll());
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<MonitorResponse> create(@RequestBody MonitorRequest request) {
    return ResponseEntity.ok(monitorService.create(request));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody MonitorRequest request) {
    monitorService.updateMonitor(id, request);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    monitorService.deleteMonitor(id);
    return ResponseEntity.noContent().build();
  }

}

package com.isis.moniTrack.service;

import com.isis.moniTrack.dto.response.BulkUploadResult;
import com.isis.moniTrack.model.Monitor;
import com.isis.moniTrack.repository.MonitorRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class MonitorBulkService {

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public BulkUploadResult importFromExcel(MultipartFile file) {
        BulkUploadResult result = new BulkUploadResult();

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            int rowIndex = 0;

            for (Row row : sheet) {
                rowIndex++;

                // saltar encabezado
                if (rowIndex == 1) continue;

                try {
                    String email = getCellValueAsString(row.getCell(0)).trim();
                    String password = getCellValueAsString(row.getCell(1)).trim();
                    String name = getCellValueAsString(row.getCell(2)).trim();
                    String role = getCellValueAsString(row.getCell(3)).trim();

                    if (email.isEmpty() || password.isEmpty() || role.isEmpty()) {
                        result.setFailed(result.getFailed() + 1);
                        result.getErrors().add("Fila " + rowIndex + ": campos obligatorios vacíos");
                        continue;
                    }

                    Monitor monitor = monitorRepository.findByEmail(email);

                    if (monitor == null) {
                        monitor = new Monitor();
                        monitor.setEmail(email);
                        monitor.setPassword(passwordEncoder.encode(password));
                        monitor.setName(name);
                        monitor.setRole(role.toUpperCase());
                        monitorRepository.save(monitor);

                        result.setInserted(result.getInserted() + 1);
                    } else {
                        monitor.setName(name);
                        monitor.setRole(role.toUpperCase());
                        monitorRepository.save(monitor);

                        result.setUpdated(result.getUpdated() + 1);
                    }

                } catch (Exception e) {
                    result.setFailed(result.getFailed() + 1);
                    result.getErrors().add("Fila " + rowIndex + ": " + e.getMessage());
                }
            }

        } catch (Exception e) {
            result.setFailed(result.getFailed() + 1);
            result.getErrors().add("Error general: " + e.getMessage());
        }

        return result;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
}

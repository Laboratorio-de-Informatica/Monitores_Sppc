package com.isis.moniTrack.dto.response;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkUploadResult {
    private int inserted;
    private int updated;
    private int failed;
    private List<String> errors = new ArrayList<>();

    // Métodos utilitarios
    public void incrementInserted() {
        this.inserted++;
    }

    public void incrementUpdated() {
        this.updated++;
    }

    public void incrementFailed() {
        this.failed++;
    }

    public void addError(String error) {
        this.errors.add(error);
        incrementFailed();
    }
}

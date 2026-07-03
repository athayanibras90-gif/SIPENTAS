package com.sipentas.Api.dto;

import java.time.LocalDateTime;

public class KeluhanResponse {
    private Integer id;
    private String isiKeluhan;
    private String pengirim; // Ini yang akan berisi NIM atau "Anonim"
    private LocalDateTime createdAt;

    public KeluhanResponse(Integer id, String isiKeluhan, String pengirim, LocalDateTime createdAt) {
        this.id = id;
        this.isiKeluhan = isiKeluhan;
        this.pengirim = pengirim;
        this.createdAt = createdAt;
    }

    // Getter
    public Integer getId() { return id; }
    public String getIsiKeluhan() { return isiKeluhan; }
    public String getPengirim() { return pengirim; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
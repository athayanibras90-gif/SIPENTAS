package com.sipentas.Api.dto;

public class KeluhanResponse {

    private String nim;
    private String isiKeluhan;
    private Boolean isAnonim;
    private String createdAt;
    private String gambar;  // ← TAMBAHKAN INI!

    // ========== CONSTRUCTORS ==========
    public KeluhanResponse() {}

    public KeluhanResponse(String nim, String isiKeluhan, Boolean isAnonim, String createdAt, String gambar) {
        this.nim = nim;
        this.isiKeluhan = isiKeluhan;
        this.isAnonim = isAnonim;
        this.createdAt = createdAt;
        this.gambar = gambar;
    }

    // ========== GETTER & SETTER ==========
    public String getNim() { return nim; }
    public void setNim(String nim) { this.nim = nim; }

    public String getIsiKeluhan() { return isiKeluhan; }
    public void setIsiKeluhan(String isiKeluhan) { this.isiKeluhan = isiKeluhan; }

    public Boolean getIsAnonim() { return isAnonim; }
    public void setIsAnonim(Boolean isAnonim) { this.isAnonim = isAnonim; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getGambar() { return gambar; }
    public void setGambar(String gambar) { this.gambar = gambar; }
}
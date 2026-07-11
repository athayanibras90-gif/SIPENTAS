package com.sipentas.Api.controller;

import com.sipentas.Api.dto.KeluhanResponse;
import com.sipentas.Api.entity.User;
import com.sipentas.Api.repository.UserRepository;
import com.sipentas.Api.service.KeluhanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/keluhan")
public class KeluhanController {

    @Autowired
    private KeluhanService keluhanService;

    @Autowired
    private UserRepository userRepository;

    // API Key default
    private final String VALID_API_KEY = "SIPENTAS-APP-FIXED-KEY";

    // Folder upload
    private final String UPLOAD_DIR = "uploads/";

    // ========== HELPER: VALIDASI API KEY ==========
    private boolean validateApiKey(String apiKey) {
        return apiKey != null && apiKey.equals(VALID_API_KEY);
    }

    // ========== HELPER: VALIDASI TOKEN ==========
    private boolean validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        return token.startsWith("SIPENTAS-");
    }

    // ========== 1. GET SEMUA KELUHAN ==========
    @GetMapping
    public Object getSemuaKeluhan(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestHeader(value = "Authorization", required =false) String authHeader) {

        if (!validateApiKey(apiKey)) {
            return "{\"success\":false,\"message\":\"API Key tidak valid\"}";
        }
        if (!validateToken(authHeader)) {
            return "{\"success\":false,\"message\":\"Token tidak valid atau tidak ada\"}";
        }

        return keluhanService.ambilSemuaKeluhan();
    }

    // ========== 2. TAMBAH KELUHAN (TANPA GAMBAR) ==========
    @PostMapping
    public String tambahKeluhan(
            @RequestParam String nim,
            @RequestParam String isiKeluhan,
            @RequestParam Boolean isAnonim,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateApiKey(apiKey)) return "Gagal: API Key tidak valid";
        if (!validateToken(authHeader)) return "Gagal: Token tidak valid atau tidak ada";

        User user = userRepository.findById(nim).orElse(null);
        if (user == null) {
            return "Gagal: User dengan NIM tersebut tidak ditemukan di sistem!";
        }

        keluhanService.buatKeluhan(user, isiKeluhan, isAnonim, null);
        return "Berhasil: Keluhan kamu sudah tersimpan!";
    }

    // ========== 3. TAMBAH KELUHAN + UPLOAD GAMBAR ==========
    @PostMapping("/upload")
    public String tambahKeluhanDenganGambar(
            @RequestParam String nim,
            @RequestParam String isiKeluhan,
            @RequestParam Boolean isAnonim,
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (!validateApiKey(apiKey)) return "Gagal: API Key tidak valid";
        if (!validateToken(authHeader)) return "Gagal: Token tidak valid atau tidak ada";

        User user = userRepository.findById(nim).orElse(null);
        if (user == null) {
            return "Gagal: User dengan NIM tersebut tidak ditemukan di sistem!";
        }

        // ========== UPLOAD GAMBAR ==========
        String fileName = null;
        try {
            // Buat folder uploads kalau belum ada
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Generate nama file unik
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            fileName = UUID.randomUUID().toString() + extension;

            // Simpan file
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());

        } catch (IOException e) {
            return "Gagal: Gagal upload gambar - " + e.getMessage();
        }

        // Simpan keluhan dengan nama gambar
        keluhanService.buatKeluhan(user, isiKeluhan, isAnonim, fileName);
        return "Berhasil: Keluhan + gambar sudah tersimpan!";
    }
}
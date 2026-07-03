package com.sipentas.Api.controller;

import com.sipentas.Api.dto.KeluhanResponse;
import com.sipentas.Api.entity.User;
import com.sipentas.Api.repository.UserRepository;
import com.sipentas.Api.service.KeluhanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keluhan")
public class KeluhanController {

    @Autowired
    private KeluhanService keluhanService;

    @Autowired
    private UserRepository userRepository;

    // 🔑 API Key default
    private final String VALID_API_KEY = "SIPENTAS-APP-FIXED-KEY";

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

    // 1. GET SEMUA KELUHAN (Butuh API Key + Token)
    @GetMapping
    public Object getSemuaKeluhan(
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // 🔑 VALIDASI API KEY
        if (!validateApiKey(apiKey)) {
            return "{\"success\":false,\"message\":\"API Key tidak valid\"}";
        }

        // 🎫 VALIDASI TOKEN
        if (!validateToken(authHeader)) {
            return "{\"success\":false,\"message\":\"Token tidak valid atau tidak ada\"}";
        }

        return keluhanService.ambilSemuaKeluhan();
    }

    // 2. TAMBAH KELUHAN (Butuh API Key + Token)
    @PostMapping
    public String tambahKeluhan(
            @RequestParam String nim,
            @RequestParam String isiKeluhan,
            @RequestParam Boolean isAnonim,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // 🔑 VALIDASI API KEY
        if (!validateApiKey(apiKey)) {
            return "Gagal: API Key tidak valid";
        }

        // 🎫 VALIDASI TOKEN
        if (!validateToken(authHeader)) {
            return "Gagal: Token tidak valid atau tidak ada";
        }

        // Cari user di database berdasarkan NIM
        User user = userRepository.findById(nim).orElse(null);

        if (user == null) {
            return "Gagal: User dengan NIM tersebut tidak ditemukan di sistem!";
        }

        // Jika user ketemu, simpan keluhannya
        keluhanService.buatKeluhan(user, isiKeluhan, isAnonim);
        return "Berhasil: Keluhan kamu sudah tersimpan!";
    }
}
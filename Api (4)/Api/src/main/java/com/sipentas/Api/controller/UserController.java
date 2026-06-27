package com.sipentas.Api.controller;

import com.sipentas.Api.entity.User;
import com.sipentas.Api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;  // ← TAMBAHKAN IMPORT INI!

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ========== REGISTER (Tanpa token) ==========
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            User saved = userService.register(user);
            response.put("success", true);
            response.put("message", "Registrasi berhasil");
            response.put("data", saved);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    // ========== LOGIN (Tidak butuh token) ==========
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String nim = request.get("nim");
        String password = request.get("password");
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOptional = userService.login(nim, password);
        if (userOptional.isPresent()) {
            //Generate token
            String token = generateToken(nim);

            response.put("success", true);
            response.put("message", "Login berhasil");
            response.put("nim", nim);
            response.put("token", token);  // ← KIRIM TOKEN!
        } else {
            response.put("success", false);
            response.put("message", "NIM atau password salah");
        }
        return response;
    }

    // ========== GET USER BY NIM (Butuh token) ==========
    @GetMapping("/{nim}")
    public Map<String, Object> getUser(
            @PathVariable String nim,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        // 🔑 Validasi token
        if (!validateToken(authHeader)) {
            response.put("success", false);
            response.put("message", "Token tidak valid atau tidak ada");
            return response;
        }

        Optional<User> userOptional = userService.findByNim(nim);
        if (userOptional.isPresent()) {
            response.put("success", true);
            response.put("data", userOptional.get());
        } else {
            response.put("success", false);
            response.put("message", "User tidak ditemukan");
        }
        return response;
    }

    // ========== GET ALL USERS (Butuh token) ==========
    @GetMapping("/all")
    public Map<String, Object> getAllUsers(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        // 🔑 Validasi token
        if (!validateToken(authHeader)) {
            response.put("success", false);
            response.put("message", "Token tidak valid atau tidak ada");
            return response;
        }

        List<User> users = userService.findAll();
        response.put("success", true);
        response.put("count", users.size());
        response.put("data", users);
        return response;
    }

    // ========== UPDATE PASSWORD (Butuh token) ==========
    @PutMapping("/{nim}")
    public Map<String, Object> updatePassword(
            @PathVariable String nim,
            @RequestBody Map<String, String> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        // 🔑 Validasi token
        if (!validateToken(authHeader)) {
            response.put("success", false);
            response.put("message", "Token tidak valid atau tidak ada");
            return response;
        }

        String newPassword = request.get("password");
        User updated = userService.updatePassword(nim, newPassword);
        if (updated != null) {
            response.put("success", true);
            response.put("message", "Password berhasil diupdate");
            response.put("data", updated);
        } else {
            response.put("success", false);
            response.put("message", "User tidak ditemukan");
        }
        return response;
    }

    // ========== DELETE USER (Butuh token) ==========
    @DeleteMapping("/{nim}")
    public Map<String, Object> deleteUser(
            @PathVariable String nim,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        // 🔑 Validasi token
        if (!validateToken(authHeader)) {
            response.put("success", false);
            response.put("message", "Token tidak valid atau tidak ada");
            return response;
        }

        boolean deleted = userService.deleteByNim(nim);
        if (deleted) {
            response.put("success", true);
            response.put("message", "User berhasil dihapus");
        } else {
            response.put("success", false);
            response.put("message", "User tidak ditemukan");
        }
        return response;
    }

    // ========== HELPER: GENERATE TOKEN ==========
    private String generateToken(String nim) {
        // Format: SIPENTAS-[NIM]-[TIMESTAMP]
        return "SIPENTAS-" + nim + "-" + System.currentTimeMillis();
    }

    // ========== HELPER: VALIDATE TOKEN ==========
    private boolean validateToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        return token.startsWith("SIPENTAS-");
    }
}
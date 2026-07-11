package com.sipentas.Api.service;

import com.sipentas.Api.dto.KeluhanResponse;
import com.sipentas.Api.entity.Keluhan;
import com.sipentas.Api.entity.User;
import com.sipentas.Api.repository.KeluhanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KeluhanService {

    @Autowired
    private KeluhanRepository keluhanRepository;

    // ========== BUAT KELUHAN ==========
    public void buatKeluhan(User user, String isiKeluhan, Boolean isAnonim, String gambar) {
        Keluhan keluhan = new Keluhan(isiKeluhan, isAnonim, user);
        keluhan.setGambar(gambar);  // ← SIMPAN NAMA GAMBAR
        keluhanRepository.save(keluhan);
    }

    // ========== AMBIL SEMUA KELUHAN ==========
    public List<KeluhanResponse> ambilSemuaKeluhan() {
        List<Keluhan> keluhanList = keluhanRepository.findAllByOrderByCreatedAtDesc();

        return keluhanList.stream().map(keluhan -> {
            String nama = keluhan.getIsAnonim() ? "Anonim" : keluhan.getUser().getNim();

            return new KeluhanResponse(
                    nama,
                    keluhan.getIsiKeluhan(),
                    keluhan.getIsAnonim(),
                    keluhan.getCreatedAt().toString(),
                    keluhan.getGambar()  // ← TAMBAHKAN GAMBAR
            );
        }).collect(Collectors.toList());
    }
}
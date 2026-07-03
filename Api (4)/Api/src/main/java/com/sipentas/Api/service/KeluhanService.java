package com.sipentas.Api.service;

import com.sipentas.Api.dto.KeluhanResponse;
import com.sipentas.Api.entity.Keluhan;
import com.sipentas.Api.entity.User;
import com.sipentas.Api.repository.KeluhanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KeluhanService {

    @Autowired
    private KeluhanRepository keluhanRepository;

    // Fungsi 1: Simpan Keluhan Baru
    public void buatKeluhan(User user, String isi, Boolean isAnonim) {
        Keluhan keluhanBaru = new Keluhan(isi, isAnonim, user);
        keluhanRepository.save(keluhanBaru);
    }

    // Fungsi 2: Ambil Daftar Keluhan (Sudah Disensor)
    public List<KeluhanResponse> ambilSemuaKeluhan() {
        List<Keluhan> listKeluhan = keluhanRepository.findAll();
        List<KeluhanResponse> listAman = new ArrayList<>();

        for (Keluhan k : listKeluhan) {
            // LOGIKA UTAMA: Jika anonim = true, set pengirim jadi "Anonim"
            // Jika false, tampilkan nim (misal: 13182520090)
            String pengirim = k.getIsAnonim() ? "Anonim" : k.getUser().getNim();

            KeluhanResponse response = new KeluhanResponse(
                    k.getId(),
                    k.getIsiKeluhan(),
                    pengirim,
                    k.getCreatedAt()
            );

            listAman.add(response);
        }

        return listAman;
    }
}
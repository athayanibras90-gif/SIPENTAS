package com.sipentas.Api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "keluhan")
public class Keluhan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String isiKeluhan;

    @Column(name = "is_anonim", nullable = false)
    private Boolean isAnonim;

    // Relasi ke entity User
    @ManyToOne
    @JoinColumn(name = "nim", referencedColumnName = "nim", nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Keluhan() {}

    public Keluhan(String isiKeluhan, Boolean isAnonim, User user) {
        this.isiKeluhan = isiKeluhan;
        this.isAnonim = isAnonim;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // Getter & Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getIsiKeluhan() { return isiKeluhan; }
    public void setIsiKeluhan(String isiKeluhan) { this.isiKeluhan = isiKeluhan; }

    public Boolean getIsAnonim() { return isAnonim; }
    public void setIsAnonim(Boolean isAnonim) { this.isAnonim = isAnonim; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
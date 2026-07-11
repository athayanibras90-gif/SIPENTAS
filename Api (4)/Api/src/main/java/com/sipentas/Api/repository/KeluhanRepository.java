package com.sipentas.Api.repository;

import com.sipentas.Api.entity.Keluhan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeluhanRepository extends JpaRepository<Keluhan, Integer> {
    List<Keluhan> findAllByOrderByCreatedAtDesc();
}
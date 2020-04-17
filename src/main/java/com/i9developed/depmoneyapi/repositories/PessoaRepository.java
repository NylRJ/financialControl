package com.i9developed.depmoneyapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.i9developed.depmoneyapi.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

}

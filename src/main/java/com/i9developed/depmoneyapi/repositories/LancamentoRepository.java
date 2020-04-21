package com.i9developed.depmoneyapi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.i9developed.depmoneyapi.model.Lancamento;
import com.i9developed.depmoneyapi.repositories.lancamento.LancamentoRepositoryQuery;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> , LancamentoRepositoryQuery  {

}

package com.i9developed.depmoneyapi.repositories.lancamento;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.i9developed.depmoneyapi.model.Lancamento;
import com.i9developed.depmoneyapi.repositories.filter.LancamentoFilter;

public interface LancamentoRepositoryQuery {
	
	public Page<Lancamento> filter(LancamentoFilter lancamentoFilter, Pageable pageable);
		
		
	
}

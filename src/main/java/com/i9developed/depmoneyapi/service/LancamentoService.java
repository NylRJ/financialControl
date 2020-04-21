package com.i9developed.depmoneyapi.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.i9developed.depmoneyapi.model.Lancamento;
import com.i9developed.depmoneyapi.model.Pessoa;
import com.i9developed.depmoneyapi.repositories.LancamentoRepository;
import com.i9developed.depmoneyapi.repositories.PessoaRepository;
import com.i9developed.depmoneyapi.repositories.filter.LancamentoFilter;
import com.i9developed.depmoneyapi.service.exception.PessoaInexistenteOuInativaException;
import com.i9developed.depmoneyapi.service.exceptions.DatabaseException;
import com.i9developed.depmoneyapi.service.exceptions.ResourceNotFoundException;

@Service
public class LancamentoService {
	
	@Autowired
	private LancamentoRepository repository;
	
	@Autowired
	private PessoaRepository pessoaRepository;
	
	public Page<Lancamento> findAll(LancamentoFilter lancamentoFilter, Pageable pageable) {
		return repository.filter(lancamentoFilter, pageable);
	}
	
	public Lancamento findById(Long id) {
		Optional<Lancamento> obj = repository.findById(id);
		return obj.orElseThrow(() -> new ResourceNotFoundException(id));
	}
	
	public Lancamento insert(Lancamento obj) {
		
		Optional<Pessoa> pessoa = pessoaRepository.findById(obj.getPessoa().getCodigo());
		
		
		if(pessoa == null || pessoa.get().getAtivo() == false) {
			throw new PessoaInexistenteOuInativaException();
		}
		
		return repository.save(obj);
	}
	
	
	public void delete(Long id) {
		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}
	
	
	public ResponseEntity<Lancamento> update(Long id, Lancamento obj) {
		try {
			Lancamento entity = repository.getOne(id);
			updateData(entity, obj);
			
			repository.save(entity);
			return ResponseEntity.ok().body(entity);
			
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}
	
	private void updateData(Lancamento entity, Lancamento obj) {
		//entity.setNome(obj.getNome());
		
	}
	
}

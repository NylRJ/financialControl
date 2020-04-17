package com.i9developed.depmoneyapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.i9developed.depmoneyapi.model.Pessoa;
import com.i9developed.depmoneyapi.repositories.PessoaRepository;
import com.i9developed.depmoneyapi.service.exceptions.ResourceNotFoundException;

@Service
public class PessoaService {
	
	@Autowired
	PessoaRepository repository;
	
	public List<Pessoa> findAll() {
		return repository.findAll();
	}
	
	public Pessoa findById(Long id) {
		Optional<Pessoa> obj = repository.findById(id);
		return obj.orElseThrow(() -> new ResourceNotFoundException(id));
	}
	
	public Pessoa insert(Pessoa obj) {
		return repository.save(obj);
	}
	
}

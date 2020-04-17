package com.i9developed.depmoneyapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.i9developed.depmoneyapi.model.Categoria;
import com.i9developed.depmoneyapi.repositories.CategoriaRepository;
import com.i9developed.depmoneyapi.service.exceptions.ResourceNotFoundException;

@Service
public class CategoriaService {
	
	@Autowired
	CategoriaRepository repository;
	
	public List<Categoria> findAll() {
		return repository.findAll();
	}
	
	public Categoria findById(Long id) {
		Optional<Categoria> obj = repository.findById(id);
		return obj.orElseThrow(() -> new ResourceNotFoundException(id));
	}
	
	public Categoria insert(Categoria obj) {
		return repository.save(obj);
	}
	
}

package com.i9developed.depmoneyapi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.i9developed.depmoneyapi.model.Categoria;
import com.i9developed.depmoneyapi.repositories.CategoriaRepository;
import com.i9developed.depmoneyapi.service.exceptions.DatabaseException;
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
	
	
	public void delete(Long id) {
		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}
	
	
	public ResponseEntity<Categoria> update(Long id, Categoria obj) {
		try {
			Categoria entity = repository.getOne(id);
			updateData(entity, obj);
			
			repository.save(entity);
			return ResponseEntity.ok().body(entity);
			
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}
	
	private void updateData(Categoria entity, Categoria obj) {
		entity.setNome(obj.getNome());
		
	}
	
}

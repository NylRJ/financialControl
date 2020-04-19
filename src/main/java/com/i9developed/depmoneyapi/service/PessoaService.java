package com.i9developed.depmoneyapi.service;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.i9developed.depmoneyapi.model.Pessoa;
import com.i9developed.depmoneyapi.repositories.PessoaRepository;
import com.i9developed.depmoneyapi.service.exceptions.DatabaseException;
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

	public void delete(Long id) {
		try {
			repository.deleteById(id);
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException(e.getMessage());
		}
	}

	public Pessoa update(Long id, Pessoa obj) {
		try {
			Pessoa entity = repository.getOne(id);
			updateData(entity, obj);
			return repository.save(entity);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);

		}
	}

	private void updateData(Pessoa entity, Pessoa obj) {
		entity.setNome(obj.getNome());
		entity.setAtivo(obj.getAtivo());
		entity.getEndereco().setNumero(obj.getEndereco().getNumero());
		entity.getEndereco().setComplemento(obj.getEndereco().getComplemento());
		entity.getEndereco().setBairro(obj.getEndereco().getBairro());
		entity.getEndereco().setCep(obj.getEndereco().getCep());
		entity.getEndereco().setCidade(obj.getEndereco().getCidade());
		entity.getEndereco().setEstado(obj.getEndereco().getEstado());
		entity.getEndereco().setLagradouro(obj.getEndereco().getLagradouro());
	}
	
	public Pessoa update(Long id, Boolean ativo) {
		try {
			Pessoa entity = repository.getOne(id);
			updateData(entity, ativo);
			return repository.save(entity);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);

		}
	}

	private void updateData(Pessoa entity, Boolean ativo) {
		
		entity.setAtivo(ativo);
		
	}
	
}

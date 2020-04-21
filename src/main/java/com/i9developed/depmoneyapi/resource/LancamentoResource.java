package com.i9developed.depmoneyapi.resource;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.i9developed.depmoneyapi.model.Lancamento;
import com.i9developed.depmoneyapi.repositories.filter.LancamentoFilter;
import com.i9developed.depmoneyapi.service.LancamentoService;


@RestController
@RequestMapping(value = "/lancamentos")
public class LancamentoResource {

	

	@Autowired
	LancamentoService service;
	

	

	@GetMapping
	public ResponseEntity<Page<Lancamento>> findAll(LancamentoFilter lancamentoFilter, Pageable pageable) {
		 
		Page<Lancamento> list = service.findAll(lancamentoFilter, pageable);
		return ResponseEntity.ok().body(list);
	}
	
	@GetMapping(value = "/{codigo}")
	public ResponseEntity<Lancamento> findById(@PathVariable Long codigo) {
		Lancamento obj = service.findById(codigo);
		return ResponseEntity.ok().body(obj);
	}
	
	@PostMapping
	public ResponseEntity<Lancamento> insert(@Valid @RequestBody Lancamento lancamento) {
		Lancamento obj = service.insert(lancamento);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri().path("/{codigo}")
				.buildAndExpand(lancamento.getCodigo()).toUri();
		return ResponseEntity.created(uri).body(obj);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	

	@PutMapping(value = "/{id}")
	public ResponseEntity<Lancamento> update(@PathVariable Long id, @Valid @RequestBody Lancamento lancamento) {
		service.update(id,lancamento);
		return ResponseEntity.noContent().build();
	}
	
}

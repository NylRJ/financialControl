package com.i9developed.depmoneyapi.resource;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.i9developed.depmoneyapi.model.Pessoa;
import com.i9developed.depmoneyapi.service.PessoaService;


@RestController
@RequestMapping(value = "/pessoas")
public class PessoaResource {

	

	@Autowired
	PessoaService service;
	

	@GetMapping
	public ResponseEntity<List<Pessoa>> findAll() {
		List<Pessoa> list = service.findAll();
		return ResponseEntity.ok().body(list);
	}
	
	@GetMapping(value = "/{codigo}")
	public ResponseEntity<Pessoa> findById(@PathVariable Long codigo) {
		Pessoa obj = service.findById(codigo);
		return ResponseEntity.ok().body(obj);
	}
	
	@PostMapping
	public ResponseEntity<Pessoa> insert(@Valid @RequestBody Pessoa Pessoa) {
		Pessoa obj = service.insert(Pessoa);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri().path("/{codigo}")
				.buildAndExpand(Pessoa.getCodigo()).toUri();
		return ResponseEntity.created(uri).body(obj);
	}
}

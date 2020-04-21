package com.i9developed.depmoneyapi.resource;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.i9developed.depmoneyapi.event.RecursoCriadoEvent;
import com.i9developed.depmoneyapi.model.Pessoa;
import com.i9developed.depmoneyapi.service.PessoaService;


@RestController
@RequestMapping(value = "/pessoas")
public class PessoaResource {

	

	@Autowired
	private PessoaService service;
	
	@Autowired
	private ApplicationEventPublisher publisher;
	

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
	public ResponseEntity<Pessoa> insert(@Valid @RequestBody Pessoa Pessoa, HttpServletResponse response) {
		Pessoa obj = service.insert(Pessoa);
		
		publisher.publishEvent(new RecursoCriadoEvent(this, response, obj.getCodigo()));
		
		return ResponseEntity.status(HttpStatus.CREATED).body(obj);
	}
	
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}


	@PutMapping(value = "/{id}")
	public ResponseEntity<Pessoa> update(@PathVariable Long id, @Valid @RequestBody Pessoa entity) {
		 entity = service.update(id,entity);
		return ResponseEntity.ok().body(entity);
	}
	
	@PutMapping(value = "/{id}/ativo")
	public ResponseEntity<Pessoa> update(@PathVariable Long id, @Valid @RequestBody Boolean ativo) {
		Pessoa entity = service.update(id,ativo);
		return ResponseEntity.ok().body(entity);
	}
}

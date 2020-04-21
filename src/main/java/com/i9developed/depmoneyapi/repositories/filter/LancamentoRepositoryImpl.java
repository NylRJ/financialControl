package com.i9developed.depmoneyapi.repositories.filter;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import com.i9developed.depmoneyapi.model.Lancamento;
import com.i9developed.depmoneyapi.model.Lancamento_;
import com.i9developed.depmoneyapi.repositories.lancamento.LancamentoRepositoryQuery;

public class LancamentoRepositoryImpl implements LancamentoRepositoryQuery {

	@PersistenceContext
	private EntityManager manager;

	@Override
	public Page<Lancamento> filter(LancamentoFilter lancamentoFilter, Pageable pageable) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Lancamento> criteria = builder.createQuery(Lancamento.class);
		Root<Lancamento> root = criteria.from(Lancamento.class);

		// cria as restricoes
		Predicate[] predicate = createRestrictions(lancamentoFilter, builder, root);
		criteria.where(predicate);

		TypedQuery<Lancamento> query = manager.createQuery(criteria);
		adicionarRestricoesPaginacao(query, pageable);

		return new PageImpl<>(query.getResultList(), pageable, total(lancamentoFilter));
	}

	

	private Predicate[] createRestrictions(LancamentoFilter lancamentoFilter, CriteriaBuilder builder,
			Root<Lancamento> root) {
		List<Predicate> predicates = new ArrayList<>();

		if (!StringUtils.isEmpty(lancamentoFilter.getDescricao())) {
			predicates.add(builder.like(builder.lower(root.get(Lancamento_.descricao)),
					"%" + lancamentoFilter.getDescricao().toLowerCase() + "%"));
		}

		if (lancamentoFilter.getDataVencimentoDe() != null) {
			predicates.add(
					// busca maior ou iqual
					builder.greaterThanOrEqualTo(root.get(Lancamento_.dataVencimento),
							lancamentoFilter.getDataVencimentoDe()));
		}

		if (lancamentoFilter.getDataVencimentoAte() != null) {
			predicates.add(builder.lessThanOrEqualTo(root.get(Lancamento_.dataVencimento),
					lancamentoFilter.getDataVencimentoAte()));

		}

		return predicates.toArray(new Predicate[predicates.size()]);
	}

	private void adicionarRestricoesPaginacao(TypedQuery<Lancamento> query, Pageable pageable) {
			
		int currentPage = pageable.getPageNumber();
		int totalRrecordsPerPage = pageable.getPageSize();
		
		int firstPageRecord = currentPage * totalRrecordsPerPage;
		query.setFirstResult(firstPageRecord);
		query.setMaxResults(totalRrecordsPerPage);
		
		
	}
	
	private Long total(LancamentoFilter lancamentoFilter) {
		CriteriaBuilder builder = manager.getCriteriaBuilder();
		CriteriaQuery<Long> criteria = builder.createQuery(Long.class);
		Root<Lancamento> root = criteria.from(Lancamento.class);
		Predicate[] predicate = createRestrictions(lancamentoFilter, builder, root);
		criteria.where(predicate);
		criteria.select(builder.count(root));
		return manager.createQuery(criteria).getSingleResult();
	}

}

package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl

class ConsumableRepositoryImpl : ConsumableRepositoryCustom {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    override fun findAll(search: String): Page<Consumable> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Consumable::class.java)
        val consumableRoot = query.from(Consumable::class.java)
        val newQuery = preparePredicate(query, consumableRoot, search, cb)
        val tq = entityManager.createQuery(newQuery)
        return PageImpl(tq.resultList)
    }
}
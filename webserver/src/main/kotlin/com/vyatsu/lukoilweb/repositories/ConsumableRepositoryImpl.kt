package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.utils.preparePredicate
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

@Suppress("unused")
class ConsumableRepositoryImpl : ConsumableRepositoryCustom {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    override fun findAllBySearch(limit: Pageable, search: String): Page<Consumable> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Consumable::class.java)
        val consumableRoot = query.from(Consumable::class.java)
        val newQuery = preparePredicate(query, consumableRoot, search, cb)
        val tq = entityManager.createQuery(newQuery)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }
}
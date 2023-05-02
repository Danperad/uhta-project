package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

@Suppress("unused")
class ConsumableRepositoryImpl : ConsumableRepositoryCustom {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    override fun findAll(limit: Pageable): Page<Consumable> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Consumable::class.java)
        val consumableRoot = query.from(Consumable::class.java)
        query.where(cb.isFalse(consumableRoot.get("isDeleted")))
        val tq = entityManager.createQuery(query)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }

    override fun findAll(limit: Pageable, search: String): Page<Consumable> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Consumable::class.java)
        val consumableRoot = query.from(Consumable::class.java)
        val newQuery = preparePredicate(query, consumableRoot, search, cb)
        val tq = entityManager.createQuery(newQuery)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }

    override fun findConsumableByCsss(csss: Int): Consumable? {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Consumable::class.java)
        val consumableRoot = query.from(Consumable::class.java)
        query.where(
            cb.and(
                cb.isFalse(consumableRoot.get("isDeleted")),
                cb.equal(consumableRoot.get<Int>("csss"), csss)
            )
        )
        val tq = entityManager.createQuery(query)
        return try {
            tq.singleResult
        } catch (e: Exception){
            null
        }
    }
}
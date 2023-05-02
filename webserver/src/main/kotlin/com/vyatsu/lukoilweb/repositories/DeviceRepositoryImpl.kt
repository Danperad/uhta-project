package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

@Suppress("unused")
class DeviceRepositoryImpl : DeviceRepositoryCustom {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    override fun findAll(limit: Pageable): Page<Device> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Device::class.java)
        val deviceRoot = query.from(Device::class.java)
        query.where(
            cb.isFalse(deviceRoot.get("isDeleted"))
        )
        val tq = entityManager.createQuery(query)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }

    override fun findAll(limit: Pageable, search: String): Page<Device> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Device::class.java)
        val deviceRoot = query.from(Device::class.java)
        val newQuery = preparePredicate(query, deviceRoot, search, cb)
        val tq = entityManager.createQuery(newQuery)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }

    override fun findDeviceByCsss(csss: Int): Device? {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Device::class.java)
        val deviceRoot = query.from(Device::class.java)
        query.where(
            cb.and(
                cb.isFalse(deviceRoot.get("isDeleted")),
                cb.equal(deviceRoot.get<Int>("csss"), csss)
            )
        )
        val tq = entityManager.createQuery(query)
        return tq.singleResult
    }
}
package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl


class DeviceRepositoryImpl : DeviceRepositoryCustom{
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    override fun findAll(search: String): Page<Device> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Device::class.java)
        val deviceRoot = query.from(Device::class.java)
        val newQuery = preparePredicate(query, deviceRoot, search, cb)
        val tq = entityManager.createQuery(newQuery)
        return PageImpl(tq.resultList)
    }
}
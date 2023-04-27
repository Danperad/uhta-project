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
        val titleSearch = cb.like(deviceRoot.get("title"), "%$search%")
//        val titleSearch = cb.function(
//            "CONTAINS",
//            Boolean::class.java,
//            deviceRoot.get<String>("title"),
//            cb.parameter(String::class.java, "search")
//        )
        val intSearch = search.toIntOrNull()
        if (intSearch != null){
            val csssSearch = cb.equal(deviceRoot.get<Int>("csss"), intSearch)
            val nrSearch = cb.equal(deviceRoot.get<Int>("nr"), intSearch)
            val resultPredicate = cb.or(titleSearch, csssSearch, nrSearch)
            query.where(
                resultPredicate
            )
        } else {
            query.where(titleSearch)
        }
        val tq = entityManager.createQuery(query)
//        tq.setParameter("search", search)
        return PageImpl(tq.resultList)
    }
}
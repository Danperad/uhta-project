package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.application.Application
import com.vyatsu.lukoilweb.models.application.ApplicationStatuses
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Root
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import java.util.*

@Suppress("unused")
class ApplicationRepositoryImpl : ApplicationRepositoryCustom {
    @PersistenceContext
    private lateinit var entityManager: EntityManager
    override fun findAllBySearch(
            limit: Pageable,
            search: String?,
            inArchive: Boolean,
            status: ApplicationStatuses?,
            startDate: Date?,
            endDate: Date?
        ): Page<Application> {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(Application::class.java)
        val consumableRoot = query.from(Application::class.java)
        val newQuery = preparePredicate(query, consumableRoot, search, inArchive, status, startDate, endDate, cb)
        val tq = entityManager.createQuery(newQuery)
        tq.setFirstResult(limit.pageNumber * limit.pageSize)
        tq.setMaxResults(limit.pageSize)
        return PageImpl(tq.resultList)
    }

    fun <T : Application> preparePredicate(
        query: CriteriaQuery<T>,
        applicationRoot: Root<T>,
        search: String?,
        inArchive: Boolean,
        status: ApplicationStatuses?,
        startDate: Date?,
        endDate: Date?,
        cb: CriteriaBuilder
    ): CriteriaQuery<T> {
        var resultPredict = cb.isFalse(applicationRoot.get("isDeleted"))
        resultPredict = if (inArchive) {
            cb.and(resultPredict, cb.isTrue(applicationRoot.get("inArchive")))
        } else {
            cb.and(resultPredict, cb.isFalse(applicationRoot.get("inArchive")))
        }
        if (search != null){
            cb.and(resultPredict, cb.like(applicationRoot.get("title"), "%$search%"))
        }
        if(status != null){
            cb.and(resultPredict, cb.equal(applicationRoot.get<ApplicationStatuses>("status"), status))
        }
        if(startDate != null && endDate == null){
            cb.and(resultPredict, cb.equal(applicationRoot.get<Date>("date"), startDate))
        }
        if(startDate != null && endDate != null){
            cb.and(resultPredict, cb.between(applicationRoot.get("date"), startDate, endDate))
        }

        query.where(
            resultPredict
        )
        return query
    }
}
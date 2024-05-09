package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.application.Application
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ApplicationRepository : JpaRepository<Application, Int>, ApplicationRepositoryCustom {
    fun findApplicationByNumber(number: Int): Application?
    fun findAllByPeriodNotNull() : List<Application>
    fun findAllByInArchiveFalseAndIsDeletedFalseOrderByNumberDesc(pageable: Pageable) : List<Application>
    fun findAllByInArchiveTrueAndIsDeletedFalseOrderByNumberDesc(pageable: Pageable) : List<Application>
}
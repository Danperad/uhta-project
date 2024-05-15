package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Logs
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LogsRepository : JpaRepository<Logs, Int>{
    fun findAllByOrderByDateDesc(pageable: Pageable) : List<Logs>;
}
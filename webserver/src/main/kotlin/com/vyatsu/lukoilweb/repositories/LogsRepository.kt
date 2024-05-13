package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.application.Logs
import org.springframework.data.domain.Pageable

interface LogsRepository {
    fun findAllOrderByIdDesc(pageable: Pageable) : List<Logs>
}
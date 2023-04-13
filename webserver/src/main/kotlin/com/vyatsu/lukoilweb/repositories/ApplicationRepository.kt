package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Application
import org.springframework.stereotype.Repository

@Repository
interface ApplicationRepository : org.springframework.data.repository.Repository<Application, Int> {
    fun findAll() : List<Application>
    fun findApplicationByNumber(number: Int): Application?
}
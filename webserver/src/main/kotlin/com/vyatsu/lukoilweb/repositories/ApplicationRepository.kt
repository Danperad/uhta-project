package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Application
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ApplicationRepository : CrudRepository<Application, Int> {
    fun findApplicationByNumber(number: Int): Application?
}
package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Application
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ApplicationRepository : JpaRepository<Application, Int> {
    fun findApplicationByNumber(number: Int): Application?
}
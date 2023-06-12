package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ApplicationService(private val applicationRepository: ApplicationRepository) {
    @Transactional
    fun getAllApplications() : Set<ApplicationDTO>{
        return applicationRepository.findAll().map { it.mapToApplicationDTO() }.toSet()
    }
    @Transactional
    fun getApplicationById(id: Int) : ApplicationDTO? {
        return applicationRepository.findApplicationByNumber(id)?.mapToApplicationDTO()
    }
}
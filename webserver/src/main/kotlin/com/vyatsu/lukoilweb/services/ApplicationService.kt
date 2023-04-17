package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ApplicationModel
import com.vyatsu.lukoilweb.repositories.ApplicationRepository
import org.springframework.stereotype.Service

@Service
class ApplicationService(private val applicationRepository: ApplicationRepository) {
    fun getAllApplications() : Set<ApplicationModel>{
        return applicationRepository.findAll().map { it.convertToModel() }.toSet()
    }
    fun getApplicationById(id: Int) : ApplicationModel? {
        return applicationRepository.findApplicationByNumber(id)?.convertToModel()
    }
}
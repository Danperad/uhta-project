package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ApplicationModel
import com.vyatsu.lukoilweb.services.ApplicationService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/applications")
class ApplicationController(private val applicationService: ApplicationService) {
    @GetMapping
    fun getAllApplications() : List<ApplicationModel>{
        return applicationService.getAllApplications()
    }
    @GetMapping("{number}")
    fun getApplicationByNumber(@PathVariable number: Int) : ApplicationModel?{
        return applicationService.getApplicationById(number)
    }
}
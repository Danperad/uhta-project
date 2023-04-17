package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ApplicationModel
import com.vyatsu.lukoilweb.services.ApplicationService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/applications")
class ApplicationController(private val applicationService: ApplicationService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllApplications() : Set<ApplicationModel>{
        return applicationService.getAllApplications()
    }
    @GetMapping("{number}", produces = ["application/json"])
    fun getApplicationByNumber(@PathVariable number: Int) : ApplicationModel?{
        return applicationService.getApplicationById(number)
    }
}
package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ApplicationModel
import com.vyatsu.lukoilweb.services.ApplicationService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/applications")
class ApplicationController(private val applicationService: ApplicationService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllApplications() : ResponseEntity<Set<ApplicationModel>>{
        val applications = applicationService.getAllApplications()
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(applications)
    }
    @GetMapping("{number}", produces = ["application/json"])
    fun getApplicationByNumber(@PathVariable number: Int) : ResponseEntity<ApplicationModel?>{
        val application = applicationService.getApplicationById(number)
        return if (application != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(application)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
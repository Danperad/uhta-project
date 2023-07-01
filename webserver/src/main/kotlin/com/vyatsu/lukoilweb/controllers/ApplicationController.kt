package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.services.ApplicationService
import org.slf4j.LoggerFactory
import org.springframework.core.io.Resource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/applications")
class ApplicationController(private val applicationService: ApplicationService) {
    private val logger = LoggerFactory.getLogger(ApplicationController::class.java)

    @GetMapping("/",produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllApplications() : ResponseEntity<Set<ApplicationDTO>>{
        val applications = applicationService.getAllApplications()
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(applications)
    }
    @GetMapping("{number}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getApplicationByNumber(@PathVariable number: Int) : ResponseEntity<ApplicationDTO?>{
        val application = applicationService.getApplicationById(number)
        return if (application != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(application)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    @PostMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun saveApplication(@RequestBody @Validated applicationDTO: ApplicationDTO) : ResponseEntity<ApplicationDTO?> {
        return try {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(applicationService.saveApplication(applicationDTO))
        } catch (e: Exception){
            ResponseEntity.badRequest().build()
        }
    }
    @GetMapping("/get-xlsx", produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE])
    fun getApplicationXlsx(@RequestParam number: Int) : ResponseEntity<Resource>{
        return try {
            val stream = applicationService.getXlsxApplication(number) ?: return ResponseEntity.notFound().build()
            ResponseEntity.ok().contentLength(stream.contentLength()).contentType(MediaType.APPLICATION_OCTET_STREAM).body(stream)
        } catch (e: Exception){
            logger.error(e.message)
            e.printStackTrace()
            ResponseEntity.badRequest().build()
        }
    }
}
package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.dto.LogsDTO
import com.vyatsu.lukoilweb.services.LogsService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/logs")
class LogsController(private val logsService: LogsService) {
    private val logger = LoggerFactory.getLogger(ApplicationController::class.java)

    @GetMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllLogs(
        @RequestParam(required = false) start: Int?,
        @RequestParam(required = false) count: Int?,
        @RequestParam(required = false) search: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) dateStart: String?,
        @RequestParam(required = false) dateEnd: String?,
    ): ResponseEntity<Set<LogsDTO>> {
        logger.debug("Getting request get all logs with start=$start, count=$count, search=$search, status=$status, dateStart=$dateStart, dateEnd=$dateEnd", )
        val logs = logsService.getAllLogs(
            PageRequest.of(start ?: 0, count ?: 10), search, status, dateStart, dateEnd)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(logs)
    }

    @PostMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun addLogs(@RequestBody @Validated logsDTO: LogsDTO) : ResponseEntity<LogsDTO?> {
        logger.debug(logsDTO.toString())
        val res = logsService.addLog(logsDTO)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(res)
    }
}
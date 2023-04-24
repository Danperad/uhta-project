package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.services.ConsumableService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/consumables")
class ConsumableController(private val consumableService: ConsumableService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllDevices(): ResponseEntity<Set<ConsumableModel>> {
        val consumables = consumableService.findAllConsumables()
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumables)
    }

    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): ResponseEntity<ConsumableModel?>{
        val consumable = consumableService.findConsumableByNr(nr)
        return if (consumable != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumable)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
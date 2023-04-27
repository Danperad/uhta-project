package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.services.ConsumableService
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/consumables")
class ConsumableController(private val consumableService: ConsumableService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllConsumables(): ResponseEntity<Set<ConsumableModel>> {
        val consumables = consumableService.findAllConsumables()
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumables)
    }
    @Cacheable("consumable")
    @GetMapping("{nr}", produces = ["application/json"])
    fun getConsumableByNr(@PathVariable nr: Int): ResponseEntity<ConsumableModel?>{
        val consumable = consumableService.findConsumableByNr(nr)
        return if (consumable != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumable)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping
    fun saveConsumable(consumableModel: ConsumableModel) : ResponseEntity<ConsumableModel>{
        val consumable = consumableService.saveConsumable(consumableModel)
        return if (consumable != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumable)
        } else {
            ResponseEntity.badRequest().build()
        }
    }
}
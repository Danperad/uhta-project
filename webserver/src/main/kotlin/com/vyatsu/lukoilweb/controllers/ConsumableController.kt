package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.services.ConsumableService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/consumables")
class ConsumableController(private val consumableService: ConsumableService) {
    @GetMapping(produces = ["application/json"])
    fun getAllDevices(): List<Consumable>{
        return consumableService.findAllConsumables()
    }

    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): Consumable?{
        return consumableService.findConsumableByNr(nr)
    }
}
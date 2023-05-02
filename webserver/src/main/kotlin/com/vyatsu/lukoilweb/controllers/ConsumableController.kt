package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.services.ConsumableService
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/consumables")
class ConsumableController(private val consumableService: ConsumableService) {
    private val logger = LoggerFactory.getLogger(ConsumableController::class.java)
    @GetMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllConsumables(
        @RequestParam(required = false) start: Int?,
        @RequestParam(required = false) count: Int?,
        @RequestParam(required = false) search: String?
    ): ResponseEntity<Set<ConsumableModel>> {
        logger.debug("Getting request get all consumables with start=$start, count=$count, search=$search")
        val consumables = consumableService.findAllConsumablesPage(PageRequest.of(start ?: 0, count ?: 10), search)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumables)
    }

    @Cacheable("consumable")
    @GetMapping("{csss}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getConsumableByCsss(@PathVariable csss: Int): ResponseEntity<ConsumableModel?> {
        logger.debug("Getting request get consumable with csss=$csss")
        val consumable = consumableService.findConsumableByCsss(csss)
        return if (consumable != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumable)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun saveConsumable(@RequestBody @Validated consumableModel: ConsumableModel): ResponseEntity<ConsumableModel> {
        logger.debug("Getting request post consumable {}", consumableModel)
        val consumable = consumableService.saveConsumable(consumableModel)
        return if (consumable != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(consumable)
        } else {
            ResponseEntity.badRequest().build()
        }
    }
    @PostMapping("/delete", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun deleteConsumable(@RequestParam csss: Int): ResponseEntity<Boolean> {
        logger.debug("Getting request delete consumable with csss=$csss")
        val consumable = consumableService.deleteConsumable(csss)
        return if (consumable) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(true)
        } else {
            ResponseEntity.badRequest().build()
        }
    }
}
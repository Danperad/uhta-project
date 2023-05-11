package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.services.DeviceService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    private val logger = LoggerFactory.getLogger(DeviceController::class.java)
    @GetMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllDevices(
        @RequestParam(required = false) start: Int?,
        @RequestParam(required = false) count: Int?,
        @RequestParam(required = false) search: String?
    ): ResponseEntity<Set<DeviceModel>> {
        logger.debug("Getting request get all devices with start=$start, count=$count, search=$search")
        val devices = deviceService.findAllDevicePage(PageRequest.of(start ?: 0, count ?: 10), search)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(devices)
    }

    @GetMapping("{csss}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getDeviceByCsss(@PathVariable csss: Int): ResponseEntity<DeviceModel?> {
        logger.debug("Getting request get device with csss=$csss")
        val device = deviceService.findDeviceByCsss(csss)
        return if (device != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun saveDevice(@RequestBody @Validated deviceModel: DeviceModel) : ResponseEntity<DeviceModel?> {
        logger.debug("Getting request post device {}", deviceModel)
        val device = deviceService.saveDevice(deviceModel)
        return if (device != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/delete", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun deleteConsumable(@RequestParam csss: Int): ResponseEntity<Boolean> {
        logger.debug("Getting request delete device with csss=$csss")
        val device = deviceService.deleteDevice(csss)
        return if (device) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(true)
        } else {
            ResponseEntity.badRequest().build()
        }
    }
}
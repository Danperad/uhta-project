package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.services.DeviceService
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["*"])
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    @Cacheable("devices")
    @GetMapping("/", produces = ["application/json"])
    fun getAllDevices(
        @RequestParam(required = false) start: Int?,
        @RequestParam(required = false) count: Int?,
        @RequestParam(required = false) search: String?
    ): ResponseEntity<Set<DeviceModel>> {
        val devices = deviceService.findAllDevicePage(PageRequest.of(start ?: 0, count ?: 10), search)
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(devices)
    }

    @Cacheable("device")
    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): ResponseEntity<DeviceModel?> {
        val device = deviceService.findDeviceByNr(nr)
        return if (device != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/")
    fun saveDevice(deviceModel: DeviceModel) : ResponseEntity<DeviceModel?> {
        val device = deviceService.saveDevice(deviceModel)
        return if (device != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
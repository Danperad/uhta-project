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
        @RequestParam(required = false) start: Int = 0,
        @RequestParam(required = false) count: Int = 10
    ): ResponseEntity<Set<DeviceModel>> {
        val devices = deviceService.findAllDevicePage(PageRequest.of(start, count))
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(devices)
    }

    @Cacheable("device")
    @GetMapping("{id}", produces = ["application/json"])
    fun getDeviceById(@PathVariable id: Int): ResponseEntity<DeviceModel?> {
        val device = deviceService.findDeviceById(id)
        return if (device != null) {
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
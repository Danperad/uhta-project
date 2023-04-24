package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.services.DeviceService
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllDevices(): ResponseEntity<Set<DeviceModel>> {
        val devices = deviceService.findAllDevices()
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(devices)
    }

    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): ResponseEntity<DeviceModel?>{
        val device = deviceService.findByNr(nr)
        return if (device != null){
            ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(device)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
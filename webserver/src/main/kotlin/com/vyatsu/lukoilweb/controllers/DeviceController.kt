package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.services.DeviceService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    @GetMapping("/",produces = ["application/json"])
    fun getAllDevices(): Set<DeviceModel>{
        return deviceService.findAllDevices()
    }

    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): DeviceModel?{
        return deviceService.findByNr(nr)
    }
}
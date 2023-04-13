package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.services.DeviceService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    @GetMapping
    fun getAllDevices(): Set<Device>{
        return deviceService.findAllDevices()
    }

    @GetMapping("{nr}")
    fun getDeviceByNr(@PathVariable nr: Int): Device?{
        return deviceService.findByNr(nr)
    }
}
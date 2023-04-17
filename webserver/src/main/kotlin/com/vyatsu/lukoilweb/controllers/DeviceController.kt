package com.vyatsu.lukoilweb.controllers

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.services.DeviceService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/devices")
class DeviceController(private val deviceService: DeviceService) {
    val logger: Logger = LoggerFactory.getLogger(DeviceController::class.java)
    @GetMapping("/",produces = ["application/json"])
    fun getAllDevices(): Set<Device>{
        logger.trace("Getting All Devices")
        return deviceService.findAllDevices()
    }

    @GetMapping("{nr}", produces = ["application/json"])
    fun getDeviceByNr(@PathVariable nr: Int): Device?{
        return deviceService.findByNr(nr)
    }
}
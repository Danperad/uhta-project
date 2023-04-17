package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.repositories.MaterialRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class DeviceService(private val materialRepository: MaterialRepository) {
    val logger : Logger = LoggerFactory.getLogger(DeviceService::class.java)
    fun findAllDevices(): Set<Device> {
        val materials = materialRepository.findAllByMaterialType("Прибор")
        logger.info("Getting All Materials with type device")
        return materials.map { it.convertToDevice() }.toSet()
    }

    fun findByNr(nr: Int): Device? {
        return materialRepository.findMaterialByNr(nr)?.convertToDevice()
    }
}
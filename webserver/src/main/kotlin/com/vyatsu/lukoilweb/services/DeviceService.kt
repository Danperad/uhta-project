package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.repositories.MaterialRepository
import org.springframework.stereotype.Service

@Service
class DeviceService(private val materialRepository: MaterialRepository) {
    fun findAllDevices(): Set<Device> {
        val materials = materialRepository.findAll()
        val devices = mutableSetOf<Device>()
        materials.filter { it.materialType == "Прибор" }.forEach { device ->
            devices.add(device.convertToDevice())
        }
        return devices
    }

    fun findByNr(nr: Int): Device? {
        val device = materialRepository.findMaterialByNr(nr) ?: return null
        return device.convertToDevice()
    }
}
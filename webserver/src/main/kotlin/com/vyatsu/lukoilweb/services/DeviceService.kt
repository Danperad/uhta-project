package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DeviceService(private val deviceRepository: DeviceRepository) {
    @Transactional
    fun findAllDevices(): Set<DeviceModel> {
        val materials = deviceRepository.findAll()
        return materials.map { it.toDeviceWithoutConsumables() }.toSet()
    }

    @Transactional
    fun findDeviceById(id: Int): DeviceModel? {
        return deviceRepository.findDeviceById(id)?.toDeviceModel()
    }
}
package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DeviceService(private val deviceRepository: DeviceRepository) {
    @Transactional
    fun findAllDevices(): Set<DeviceModel> {
        val materials = deviceRepository.findAll()
        return materials.map { it.toDeviceModel() }.toSet()
    }

    @Transactional
    fun findDeviceByNr(nr: Int): DeviceModel? {
        return deviceRepository.findDeviceByNr(nr)?.toDeviceModel()
    }
    @Transactional
    fun findAllDevicePage(limit: Pageable): Set<DeviceModel>{
        return deviceRepository.findAll(limit).map { it.toDeviceModel() }.toSet()
    }

    fun saveDevice(deviceModel: DeviceModel) : DeviceModel? {
        val device = deviceModel.getDevice()
        return try {
            deviceRepository.save(device).toDeviceModel()
        } catch (e: Exception){
            null
        }
    }
}
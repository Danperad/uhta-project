package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Device
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
    fun findDeviceByCsss(nr: Int): DeviceModel? {
        return deviceRepository.findDeviceByCsss(nr)?.toDeviceModel()
    }
    @Transactional
    fun findAllDevicePage(limit: Pageable, search: String?): Set<DeviceModel>{
        val devices = if (search == null) {
            deviceRepository.findAll(limit)
        } else {
            deviceRepository.findAll(search)
        }
        return devices.map { it.toDeviceModel() }.toSet()
    }

    @Transactional
    fun saveDevice(deviceModel: DeviceModel) : DeviceModel? {
        val device = deviceModel.getDevice()
        return try {
            deviceRepository.save(device).toDeviceModel()
        } catch (e: Exception){
            null
        }
    }

    @Transactional
    fun deleteDevice(deviceModel: DeviceModel): DeviceModel? {
        val device = deviceRepository.findDeviceByCsss(deviceModel.csss) ?: return null
        val newDevice = Device(
            device.csss,
            device.nr,
            device.title,
            device.producer,
            device.unitOfMeasurement,
            true,
            device.inStock,
            device.inOperation,
            listOf(),
            device.id
        )
        return try {
            deviceRepository.save(newDevice).toDeviceWithoutConsumables()
        } catch (e: Exception) {
            null
        }
    }
}
package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.models.DeviceModel
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val consumableRepository: ConsumableRepository
) {
    @Transactional
    fun findDeviceByCsss(nr: Int): DeviceModel? {
        return deviceRepository.findDeviceByCsss(nr)?.toDeviceModel()
    }

    @Transactional
    fun findAllDevicePage(limit: Pageable, search: String?): Set<DeviceModel> {
        val devices = if (search == null) {
            deviceRepository.findAll(limit)
        } else {
            deviceRepository.findAll(limit, search)
        }
        return devices.map { it.toDeviceModel() }.toSet()
    }

    @Transactional
    fun saveDevice(deviceModel: DeviceModel): DeviceModel? {
        var device = deviceModel.getDevice()
        val csssDevice = deviceRepository.findDeviceByCsss(device.csss)
        if ((device.id == null || device.id == 0) && csssDevice != null) return null
        if (deviceModel.consumables.isNotEmpty()) {
            device = Device(
                device.csss,
                device.nr,
                device.title,
                device.producer,
                device.unitOfMeasurement,
                device.isDeleted,
                device.inStock,
                device.inOperation,
                device.consumables,
                device.id
            )
            val consumables =
                deviceModel.consumables.map { consumableRepository.findConsumableByCsss(it.csss) }
            if (consumables.any{it == null}) return null
            device.consumables.addAll(consumables.mapNotNull { it })
        }
        return try {
            deviceRepository.save(device).toDeviceModel()
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun deleteDevice(csss: Int): Boolean {
        val device = deviceRepository.findDeviceByCsss(csss) ?: return false
        return try {
            deviceRepository.delete(device)
            true
        }catch (e: Exception){
            false
        }
    }
}
package com.vyatsu.lukoilweb.services

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
        return deviceRepository.findDeviceByCsssAndIsDeletedFalse(nr)?.toDeviceModel()
    }

    @Transactional
    fun findAllDevicePage(limit: Pageable, search: String?): Set<DeviceModel> {
        val devices = if (search == null) {
            deviceRepository.findAllByIsDeletedFalse(limit)
        } else {
            deviceRepository.findAllBySearch(limit, search)
        }
        return devices.map { it.toDeviceModel() }.toSet()
    }

    @Transactional
    fun saveDevice(deviceModel: DeviceModel): DeviceModel? {
        val device = deviceModel.getDevice()
        val csssDevice = deviceRepository.findDeviceByCsssAndIsDeletedFalse(device.csss)
        if ((device.id == null || device.id == 0) && csssDevice != null) return null
        if (deviceModel.consumables.isNotEmpty()) {
            val consumables =
                deviceModel.consumables.map { consumableRepository.findConsumableByCsssAndIsDeletedFalse(it.csss) }
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
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(csss)?.copy(isDeleted = true) ?: return false
        return try {
            deviceRepository.save(device)
            true
        } catch (e: Exception) {
            false
        }
    }
}
package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.dto.DeviceDTO
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
    fun findDeviceByCsss(nr: Int): DeviceDTO? {
        return deviceRepository.findDeviceByCsssAndIsDeletedFalse(nr)?.mapToDeviceDTO()
    }

    @Transactional
    fun findAllDevicePage(limit: Pageable, search: String?): Set<DeviceDTO> {
        val devices = if (search == null) {
            deviceRepository.findAllByIsDeletedFalse(limit)
        } else {
            deviceRepository.findAllBySearch(limit, search)
        }
        return devices.map { it.mapToDeviceDTO() }.toSet()
    }

    @Transactional
    fun saveDevice(deviceDTO: DeviceDTO): DeviceDTO? {
        val device = deviceDTO.mapToDevice()
        val csssDevice = deviceRepository.findDeviceByCsssAndIsDeletedFalse(device.csss)
        if ((device.id == null || device.id == 0) && csssDevice != null) return null
        if (deviceDTO.consumables.isNotEmpty()) {
            if (deviceDTO.consumables.any { it.device == null }) return null
            val consumables = deviceDTO.consumables.map {
                val consumable = consumableRepository.findConsumableByCsssAndIsDeletedFalse(it.device!!.csss) ?: return null
                it.mapToBinding(device, consumable)
            }
            device.consumables.clear()
            device.consumables.addAll(consumables)
        }
        return try {
            deviceRepository.save(device).mapToDeviceDTO()
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun deleteDevice(csss: Int): Boolean {
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(csss)?.copy(isDeleted = true, consumables = mutableListOf()) ?: return false
        return try {
            deviceRepository.save(device).isDeleted
        } catch (e: Exception) {
            false
        }
    }
}
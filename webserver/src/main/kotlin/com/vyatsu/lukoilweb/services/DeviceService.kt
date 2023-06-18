package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.dto.DeviceDTO
import com.vyatsu.lukoilweb.repositories.BindingRepository
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val consumableRepository: ConsumableRepository,
    private val bindingRepository: BindingRepository
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
        if ((device.id == null || device.id == 0) && csssDevice != null)
            TODO()

        if (csssDevice != null && csssDevice.consumables.isNotEmpty()) {
            if (deviceDTO.consumables.any { it.device == null })
                TODO()
            if (deviceDTO.consumables.any { consumableRepository.findConsumableByCsssAndIsDeletedFalse(it.consumable!!.csss) == null })
                TODO()
            if (!csssDevice.consumables.all { first -> device.consumables.any { it.consumable.csss == first.consumable.csss } }) {
                val bindings =
                    csssDevice.consumables.filter { first -> !device.consumables.any { it.consumable.csss == first.device.csss } }.map { it.copy(isDeleted = true) }
                bindingRepository.saveAll(bindings)
            }
        }

        return deviceRepository.save(device).mapToDeviceDTO()
    }

    @Transactional
    fun deleteDevice(csss: Int): Boolean {
        val device = deviceRepository.findDeviceByCsssAndIsDeletedFalse(csss)
            ?.copy(isDeleted = true, consumables = mutableListOf()) ?: return false
        return try {
            deviceRepository.save(device).isDeleted
        } catch (e: Exception) {
            false
        }
    }
}
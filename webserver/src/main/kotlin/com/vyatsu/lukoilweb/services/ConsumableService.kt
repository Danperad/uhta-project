package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ConsumableDTO
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ConsumableService(
    private val consumableRepository: ConsumableRepository,
    private val deviceRepository: DeviceRepository
) {
    @Transactional
    fun findAllConsumablesPage(limit: Pageable, search: String?): Set<ConsumableDTO> {
        val consumables = if (search == null) {
            consumableRepository.findAllByIsDeletedFalse(limit)
        } else {
            consumableRepository.findAllBySearch(limit, search)
        }
        return consumables.map { it.mapToConsumableDTO() }.toSet()
    }

    @Transactional
    fun findConsumableByCsss(csss: Int): ConsumableDTO? {
        return consumableRepository.findConsumableByCsssAndIsDeletedFalse(csss)?.mapToConsumableDTO()
    }

    @Transactional
    fun saveConsumable(consumableDTO: ConsumableDTO): ConsumableDTO? {
        val consumable = consumableDTO.mapToConsumable()
        val csssConsumable = consumableRepository.findConsumableByCsssAndIsDeletedFalse(consumable.csss)
        if ((consumable.id == null || consumable.id == 0) && csssConsumable != null) return null
        if (consumableDTO.devices.isNotEmpty()) {
            val devices =
                consumableDTO.devices.map { deviceRepository.findDeviceByCsssAndIsDeletedFalse(it.csss) }
            if (devices.any { it == null }) return null
            consumable.devices.clear()
            consumable.devices.addAll(devices.mapNotNull { it })
        }
        return try {
            consumableRepository.save(consumable).mapToConsumableDTOWithoutDevices()
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun deleteConsumable(csss: Int): Boolean {
        val consumable =
            consumableRepository.findConsumableByCsssAndIsDeletedFalse(csss)?.copy(isDeleted = true, devices = mutableListOf()) ?: return false
        return try {
            consumableRepository.save(consumable).isDeleted
        } catch (e: Exception) {
            false
        }
    }
}
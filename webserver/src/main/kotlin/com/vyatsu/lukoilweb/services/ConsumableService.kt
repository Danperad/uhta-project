package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ConsumableModel
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
    fun findAllConsumablesPage(limit: Pageable, search: String?): Set<ConsumableModel> {
        val consumables = if (search == null) {
            consumableRepository.findAllByIsDeletedFalse(limit)
        } else {
            consumableRepository.findAllBySearch(limit, search)
        }
        return consumables.map { it.toConsumableModel() }.toSet()
    }

    @Transactional
    fun findConsumableByCsss(csss: Int): ConsumableModel? {
        return consumableRepository.findConsumableByCsssAndIsDeletedFalse(csss)?.toConsumableModel()
    }

    @Transactional
    fun saveConsumable(consumableModel: ConsumableModel): ConsumableModel? {
        val consumable = consumableModel.getConsumable()
        val csssConsumable = consumableRepository.findConsumableByCsssAndIsDeletedFalse(consumable.csss)
        if ((consumable.id == null || consumable.id == 0) && csssConsumable != null) return null
        if (consumableModel.devices.isNotEmpty()) {
            val devices =
                consumableModel.devices.map { deviceRepository.findDeviceByCsssAndIsDeletedFalse(it.csss) }
            if (devices.any { it == null }) return null
            consumable.devices.addAll(devices.mapNotNull { it })
        }
        return try {
            consumableRepository.save(consumable).toConsumableModelWithoutDevices()
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun deleteConsumable(csss: Int): Boolean {
        val consumable =
            consumableRepository.findConsumableByCsssAndIsDeletedFalse(csss)?.copy(isDeleted = true) ?: return false
        return try {
            consumableRepository.save(consumable)
            true
        } catch (e: Exception) {
            false
        }
    }
}
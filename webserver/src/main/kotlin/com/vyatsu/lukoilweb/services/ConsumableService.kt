package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
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
            consumableRepository.findAll(limit)
        } else {
            consumableRepository.findAll(limit, search)
        }
        return consumables.map { it.toConsumableModel() }.toSet()
    }

    @Transactional
    fun findConsumableByCsss(csss: Int): ConsumableModel? {
        return consumableRepository.findConsumableByCsss(csss)?.toConsumableModel()
    }

    @Transactional
    fun saveConsumable(consumableModel: ConsumableModel): ConsumableModel? {
        var consumable = consumableModel.getConsumable()
        val csssConsumable = consumableRepository.findConsumableByCsss(consumable.csss)
        if ((consumable.id == null || consumable.id == 0) && csssConsumable != null) return null
        if (consumableModel.devices.isNotEmpty()) {
            consumable = Consumable(
                consumable.csss,
                consumable.nr,
                consumable.title,
                consumable.producer,
                consumable.unitOfMeasurement,
                consumable.isDeleted,
                consumable.inStock,
                consumable.inOperation,
                consumable.devices,
                consumable.id
            )
            val devices =
                consumableModel.devices.map { deviceRepository.findDeviceByCsss(it.csss) }
            if (devices.any {it == null}) return null
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
        val consumable = consumableRepository.findConsumableByCsss(csss) ?: return false
        return try {
            consumableRepository.delete(consumable)
            true
        } catch (e: Exception) {
            false
        }
    }
}
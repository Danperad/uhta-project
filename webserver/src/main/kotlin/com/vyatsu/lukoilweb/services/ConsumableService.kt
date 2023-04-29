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
    fun findAllConsumables(): Set<ConsumableModel> {
        val materials = consumableRepository.findAll()
        return materials.map { it.toConsumableModelWithoutDevices() }.toSet()
    }

    @Transactional
    fun findAllConsumablesPage(limit: Pageable, search: String?): Set<ConsumableModel> {
        val consumables = if (search == null) {
            consumableRepository.findAll(limit)
        } else {
            consumableRepository.findAll(search)
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
        if (consumableModel.devices.isNotEmpty()) {
            val devices =
                consumableModel.devices.mapNotNull { deviceRepository.findDeviceByCsss(it.csss) }.toList()
            consumable = Consumable(
                consumable.csss,
                consumable.nr,
                consumable.title,
                consumable.producer,
                consumable.unitOfMeasurement,
                consumable.isDeleted,
                consumable.inStock,
                consumable.inOperation,
                devices,
                consumable.id
            )
        }
        return try {
            consumableRepository.save(consumable).toConsumableModelWithoutDevices()
        } catch (e: Exception) {
            null
        }
    }

    @Transactional
    fun deleteConsumable(consumableModel: ConsumableModel): ConsumableModel? {
        val consumable = consumableRepository.findConsumableByCsss(consumableModel.csss) ?: return null
        val newConsumable = Consumable(
            consumable.csss,
            consumable.nr,
            consumable.title,
            consumable.producer,
            consumable.unitOfMeasurement,
            true,
            consumable.inStock,
            consumable.inOperation,
            listOf(),
            consumable.id
        )
        return try {
            consumableRepository.save(newConsumable).toConsumableModelWithoutDevices()
        } catch (e: Exception) {
            null
        }
    }
}
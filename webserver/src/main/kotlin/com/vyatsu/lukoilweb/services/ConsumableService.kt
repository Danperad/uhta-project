package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.dto.ConsumableDTO
import com.vyatsu.lukoilweb.repositories.BindingRepository
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import com.vyatsu.lukoilweb.repositories.DeviceRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ConsumableService(
    private val consumableRepository: ConsumableRepository,
    private val deviceRepository: DeviceRepository,
    private val bindingRepository: BindingRepository
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
        if ((consumable.id == null || consumable.id == 0) && csssConsumable != null)
            TODO()

        if (consumableDTO.devices.isNotEmpty()) {
            if (consumableDTO.devices.any { it.device == null })
                TODO()
            if (consumableDTO.devices.any { deviceRepository.findDeviceByCsssAndIsDeletedFalse(it.device!!.csss) == null })
                TODO()
            if (csssConsumable != null && !csssConsumable.devices.all { first -> consumable.devices.any { it.device.csss == first.device.csss } }) {
                val bindings =
                    csssConsumable.devices.filter { first -> !consumable.devices.none { it.device.csss == first.device.csss } }
                bindingRepository.deleteAll(bindings)
            }
        }

        return consumableRepository.save(consumable).mapToConsumableDTO()
    }


    @Transactional
    fun deleteConsumable(csss: Int): Boolean {
        val consumable =
            consumableRepository.findConsumableByCsssAndIsDeletedFalse(csss)
                ?.copy(isDeleted = true, devices = mutableListOf()) ?: TODO()
        return try {
            consumableRepository.save(consumable).isDeleted
        } catch (e: Exception) {
            false
        }
    }
}
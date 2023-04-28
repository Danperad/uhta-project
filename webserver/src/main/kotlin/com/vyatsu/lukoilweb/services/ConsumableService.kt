package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import org.hibernate.sql.ast.tree.predicate.Predicate
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ConsumableService(private val consumableRepository: ConsumableRepository) {
    @Transactional
    fun findAllConsumables(): Set<ConsumableModel> {
        val materials = consumableRepository.findAll()
        return materials.map { it.toConsumableModelWithoutDevices() }.toSet()
    }

    @Transactional
    fun findAllConsumablesPage(limit: Pageable, search: String?) : Set<ConsumableModel> {
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
        val consumable = consumableModel.getConsumable()
        return try {
            consumableRepository.save(consumable).toConsumableModelWithoutDevices()
        } catch (e: Exception){
            null
        }
    }
}
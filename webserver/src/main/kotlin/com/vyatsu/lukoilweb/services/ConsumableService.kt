package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import org.springframework.stereotype.Service

@Service
class ConsumableService(private val consumableRepository: ConsumableRepository) {
    fun findAllConsumables(): Set<ConsumableModel> {
        val materials = consumableRepository.findAll()
        return materials.map { it.toConsumableModel() }.toSet()
    }
    fun findConsumableByNr(nr: Int): ConsumableModel? {
        return consumableRepository.findMaterialByNr(nr)?.toConsumableModel()
    }
}
package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.repositories.MaterialRepository
import org.springframework.stereotype.Service

@Service
class ConsumableService(private val materialRepository: MaterialRepository) {
    fun findAllConsumables(): Set<Consumable> {
        val materials = materialRepository.findAllByMaterialType("Расходник")
        return materials.map { it.convertToConsumable(0) }.toSet()
    }
    fun findConsumableByNr(nr: Int): Consumable? {
        return materialRepository.findMaterialByNr(nr)?.convertToConsumable(0)
    }
}
package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.repositories.MaterialRepository
import org.springframework.stereotype.Service

@Service
class ConsumableService(private val materialRepository: MaterialRepository) {
    fun findAllConsumables(): List<Consumable> {
        val materials = materialRepository.findAll()
        return materials.filter { it.materialType == "Расходник" }.map { it.convertToConsumable(0) }
    }
    fun findConsumableByNr(nr: Int): Consumable? {
        return materialRepository.findMaterialByNr(nr)?.convertToConsumable(0)
    }
}
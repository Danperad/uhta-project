package com.vyatsu.lukoilweb.services

import com.vyatsu.lukoilweb.models.ConsumableModel
import com.vyatsu.lukoilweb.repositories.ConsumableRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ConsumableService(private val consumableRepository: ConsumableRepository) {
    @Transactional
    fun findAllConsumables(): Set<ConsumableModel> {
        val materials = consumableRepository.findAll()
        return materials.map { it.toConsumableModel() }.toSet()
    }
    @Transactional
    fun findConsumableById(id: Int): ConsumableModel? {
        return consumableRepository.findConsumableById(id)?.toConsumableModel()
    }
}
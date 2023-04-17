package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.stereotype.Repository

@Repository
interface ConsumableRepository : org.springframework.data.repository.Repository<Consumable, Int> {
    fun findAll() : List<Consumable>
    fun findMaterialByNr(nr: Int) : Consumable?
}
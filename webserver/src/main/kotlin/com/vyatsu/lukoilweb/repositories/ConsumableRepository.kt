package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ConsumableRepository : CrudRepository<Consumable, Int> {
    fun findMaterialByNr(nr: Int) : Consumable?
}
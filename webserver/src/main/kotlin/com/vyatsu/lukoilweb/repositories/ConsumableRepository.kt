package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ConsumableRepository : JpaRepository<Consumable, Int>, ConsumableRepositoryCustom{
    fun findAllByIsDeletedFalse() : List<Consumable>
    fun findAllByIsDeletedFalse(pageable: Pageable) : List<Consumable>
    fun findConsumableByCsssAndIsDeletedFalse(csss: Int) : Consumable?
}
package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ConsumableRepositoryCustom {
    fun findAll(limit: Pageable) : Page<Consumable>

    fun findAll(limit: Pageable, search: String) : Page<Consumable>
    fun findConsumableByCsss(csss: Int) : Consumable?

}
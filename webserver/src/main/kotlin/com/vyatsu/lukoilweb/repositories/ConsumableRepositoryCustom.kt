package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Consumable
import org.springframework.data.domain.Page

interface ConsumableRepositoryCustom {
    fun findAll(search: String) : Page<Consumable>
}
package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Material
import org.springframework.stereotype.Repository

@Repository
interface MaterialRepository : org.springframework.data.repository.Repository<Material, Int> {
    fun findAll() : List<Material>
    fun findMaterialByNr(nr: Int) : Material?
}
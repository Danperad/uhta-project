package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DeviceRepository : CrudRepository<Device, Int> {
    fun findMaterialByNr(nr: Int) : Device?
    fun findByCsss(csss: Int) : Device?
}
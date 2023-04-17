package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.stereotype.Repository

@Repository
interface DeviceRepository : org.springframework.data.repository.Repository<Device, Int> {
    fun findAll() : List<Device>
    fun findMaterialByNr(nr: Int) : Device?
}
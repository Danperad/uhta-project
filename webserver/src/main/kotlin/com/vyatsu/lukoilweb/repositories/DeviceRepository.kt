package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DeviceRepository : CrudRepository<Device, Int> {
    fun findDeviceByNr(nr: Int) : Device?
    fun findDeviceById(id: Int) : Device?

    fun findByCsss(csss: Int) : Device?
}
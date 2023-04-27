package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DeviceRepository : JpaRepository<Device, Int>, DeviceRepositoryCustom {
    fun findDeviceByNr(nr: Int): Device?
    fun findDeviceById(id: Int): Device?

    fun findByCsss(csss: Int): Device?
}
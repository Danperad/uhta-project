package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable


interface DeviceRepositoryCustom {
    fun findAll(limit: Pageable) : Page<Device>
    fun findAll(limit: Pageable,search: String) : Page<Device>
    fun findDeviceByCsss(csss: Int): Device?

}
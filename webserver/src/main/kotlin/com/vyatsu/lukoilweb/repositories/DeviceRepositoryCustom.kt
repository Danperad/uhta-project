package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.domain.Page


interface DeviceRepositoryCustom {
    fun findAll(search: String) : Page<Device>
}
package com.vyatsu.lukoilweb.repositories

import com.vyatsu.lukoilweb.models.Device
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable


interface DeviceRepositoryCustom {
    fun findAllBySearch(limit: Pageable, search: String) : Page<Device>
}
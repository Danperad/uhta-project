package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class ApplicationDTO(
    val number: Int,
    val date: Long,
    val title: String,
    val period: Long,
    val status: String,
    val devices: Set<DeviceDTO>,
    val consumables: Set<ConsumableDTO>
)
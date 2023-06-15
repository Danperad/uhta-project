package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class ApplicationDTO(
    var number: Int? = null,
    val date: Long,
    val title: String,
    val period: Long?,
    val status: String,
    val devices: Set<ApplicationDeviceDTO>,
    val consumables: Set<ApplicationConsumableDTO>
)

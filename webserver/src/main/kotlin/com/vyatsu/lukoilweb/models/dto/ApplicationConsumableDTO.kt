package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class ApplicationConsumableDTO(
    var applicationNumber: Int? = null,
    val consumable: ConsumableDTO,
    val count: Int
)
package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class ApplicationModel(
    val number: Int,
    val date: Long,
    val title: String,
    val period: Long,
    val status: String,
    val devices: Set<DeviceModel>,
    val consumables: Set<ConsumableModel>
)

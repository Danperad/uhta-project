package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class ApplicationDeviceDTO(
    var applicationNumber: Int? = null,
    val device: DeviceDTO,
    val count: Int,
    val receivedQuantity: Int? = null,
    val receiptDate: Int? = null
)

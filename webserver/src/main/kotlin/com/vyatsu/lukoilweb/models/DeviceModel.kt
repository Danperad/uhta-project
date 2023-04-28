package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class DeviceModel(
    val id: Int,
    val title: String,
    val prducer: String,
    val csss: Int,
    val nr3: Int,
    val unitType: String,
    val inOperation: Int,
    val inStock: Int,
    val consumables: Set<ConsumableModel>
) {
    fun getDevice(): Device {
        return Device(id, csss, nr3, title, prducer, unitType, false,inStock, inOperation, consumables.map { it.getConsumable() })
    }
}
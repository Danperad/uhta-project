package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class ConsumableModel(
    val id: Int,
    val title: String,
    val prducer: String,
    val csss: Int,
    val nr3: Int,
    val unitType: String,
    val inOperation: Int,
    val inStock: Int,
    val devices: Set<DeviceModel> = setOf()
){
    fun getConsumable() : Consumable{
        return Consumable(0,csss,nr3,title, prducer, unitType, false, inStock, inOperation, devices.map { it.getDevice() })
    }
}

package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class ConsumableModel(
    var id: Int? = null,
    val title: String,
    val producer: String,
    val csss: Int,
    val nr3: Int,
    val unitType: String,
    val inOperation: Int,
    val inStock: Int,
    val devices: Set<DeviceModel> = setOf()
){
    fun getConsumable() : Consumable{
        return Consumable(csss,nr3,title, producer, UnitTypes.valueOf(unitType), false, inStock, inOperation, devices.map { it.getDevice() }.toMutableList(), id)
    }
}

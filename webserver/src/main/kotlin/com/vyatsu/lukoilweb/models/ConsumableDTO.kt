package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class ConsumableDTO(
    var id: Int? = null,
    val title: String,
    val producer: String? = null,
    val csss: Int,
    val nr3: Int,
    val unitType: String,
    val inOperation: Int,
    val inStock: Int,
    val devices: Set<DeviceDTO> = setOf()
){
    fun mapToConsumable() : Consumable{
        return Consumable(csss,nr3,title, producer, UnitTypeConverter().convertToEntityAttribute(unitType), false, inStock, inOperation, devices.map { it.mapToDevice() }.toMutableList(), id)
    }
}

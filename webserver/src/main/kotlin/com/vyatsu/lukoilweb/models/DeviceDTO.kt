package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class DeviceDTO(
    val id: Int? = null,
    val title: String,
    val producer: String? = null,
    val csss: Int,
    val nr3: Int,
    val unitType: String,
    val inOperation: Int,
    val inStock: Int,
    val consumables: Set<ConsumableDTO> = setOf()
) {
    fun mapToDevice(): Device {
        return Device(
            csss,
            nr3,
            title,
            producer,
            UnitTypeConverter().convertToEntityAttribute(unitType),
            false,
            inStock,
            inOperation,
            consumables.map { it.mapToConsumable() }.toMutableList(),
            id
        )
    }

    override fun toString(): String {
        return "DeviceDTO(id=$id, title='$title', producer=$producer, csss=$csss, nr3=$nr3, unitType='$unitType', inOperation=$inOperation, inStock=$inStock, consumables=$consumables)"
    }
}
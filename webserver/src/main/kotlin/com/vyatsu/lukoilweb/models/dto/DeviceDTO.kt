package com.vyatsu.lukoilweb.models.dto

import com.vyatsu.lukoilweb.models.Device
import com.vyatsu.lukoilweb.utils.UnitTypeConverter
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
    val consumables: Set<BindingDTO> = setOf()
) {
    fun mapToDevice(): Device {
        val device = Device(
            csss,
            nr3,
            title,
            producer,
            UnitTypeConverter().convertToEntityAttribute(unitType),
            false,
            inStock,
            inOperation,
            id = id
        )
        device.consumables.addAll(consumables.map { it.mapToBinding(device) })
        return device
    }

    override fun toString(): String {
        return "DeviceDTO(id=$id, title='$title', producer=$producer, csss=$csss, nr3=$nr3, unitType='$unitType', inOperation=$inOperation, inStock=$inStock, consumables=$consumables)"
    }
}
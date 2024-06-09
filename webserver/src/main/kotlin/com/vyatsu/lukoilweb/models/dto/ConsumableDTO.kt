package com.vyatsu.lukoilweb.models.dto

import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.utils.UnitTypeConverter
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
    val minimalAmount: Int,
    val replacementFrequency: Int,
    val devices: Set<BindingDTO> = setOf()
) {
    fun mapToConsumable(): Consumable {
        val consumable = Consumable(
            csss,
            nr3,
            title,
            producer,
            UnitTypeConverter().convertToEntityAttribute(unitType),
            false,
            inStock,
            inOperation,
            minimalAmount,
            replacementFrequency,
            id = id
        )
        consumable.devices.addAll(devices.map { it.mapToBinding(consumable) })
        return consumable
    }

    override fun toString(): String {
        return "ConsumableDTO(id=$id, title='$title', producer=$producer, csss=$csss, nr3=$nr3, unitType='$unitType', inOperation=$inOperation, inStock=$inStock,, minimalAmount=$minimalAmount, replacementFrequency=$replacementFrequency, devices=$devices)"
    }

}

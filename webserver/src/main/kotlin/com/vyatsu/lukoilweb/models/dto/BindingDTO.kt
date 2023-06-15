package com.vyatsu.lukoilweb.models.dto

import com.vyatsu.lukoilweb.models.Binding
import com.vyatsu.lukoilweb.models.Consumable
import com.vyatsu.lukoilweb.models.Device
import kotlinx.serialization.Serializable
import org.springframework.boot.json.JsonParseException

@Serializable
data class BindingDTO(
    val id: Int? = null,
    val device: DeviceDTO? = null,
    val consumable: ConsumableDTO? = null,
    val count: Int
) {
    fun mapToBinding(consumable: Consumable): Binding {
        if (device == null) throw JsonParseException()
        return Binding(device.mapToDevice(), consumable, count, id)
    }

    fun mapToBinding(device: Device): Binding {
        if (consumable == null) throw JsonParseException()
        return Binding(device, consumable.mapToConsumable(), count, id)
    }

    fun mapToBinding(device: Device, consumable: Consumable): Binding {
        return Binding(device, consumable, count, id)
    }
}

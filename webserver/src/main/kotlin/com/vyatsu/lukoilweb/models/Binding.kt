package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.dto.BindingDTO
import jakarta.persistence.*

@Entity
@Table(name = "binding")
class Binding(
    @ManyToOne(optional = false)
    @JoinColumn(name = "device_id")
    val device: Device,
    @ManyToOne(optional = false)
    @JoinColumn(name = "consumables_id")
    val consumable: Consumable,
    @Column(name = "count")
    val count: Int = 0,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "binding_id", nullable = false)
    var id: Int? = null
) {
    fun mapToBindingWithoutDevice(): BindingDTO {
        return BindingDTO(
            id,
            null,
            consumable.mapToConsumableDTOWithoutDevices(),
            count
        )
    }

    fun mapToBindingWithoutConsumable(): BindingDTO {
        return BindingDTO(
            id,
            device.mapToDeviceDTOWithoutConsumables(),
            null,
            count
        )
    }
}
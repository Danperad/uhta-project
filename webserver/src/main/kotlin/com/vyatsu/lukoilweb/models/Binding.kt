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
    @Column(name = "deleted")
    val isDeleted: Boolean = false,
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

    fun copy(
        device: Device = this.device,
        consumable: Consumable = this.consumable,
        count: Int = this.count,
        isDeleted: Boolean = this.isDeleted,
        id: Int? = this.id
    ):Binding{
        return Binding(device, consumable, count, isDeleted, id)
    }
}
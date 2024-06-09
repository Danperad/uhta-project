package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.dto.ConsumableDTO
import jakarta.persistence.*

@Entity
@Table(name = "consumables")
class Consumable(
    csss: Int,
    nr: Int,
    title: String,
    producer: String?,
    unitOfMeasurement: UnitTypes,
    isDeleted: Boolean = false,
    inStock: Int = 0,
    inOperation: Int = 0,
    minimalAmount: Int = 0,
    replacementFrequency: Int = 0,

    @OneToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE], orphanRemoval = true)
    @JoinColumn(name = "consumables_id")
    val devices: MutableList<Binding> = mutableListOf(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consumables_id", nullable = false)
    var id: Int? = null
) : MaterialBase(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, minimalAmount, replacementFrequency) {
    fun mapToConsumableDTO(): ConsumableDTO {
        val newDevices = devices.filter { !it.isDeleted }.map { it.mapToBindingWithoutConsumable() }.toSet()
        return mapToConsumableDTOWithoutDevices().copy(devices = newDevices)
    }

    fun mapToConsumableDTOWithoutDevices() =
        ConsumableDTO(id, title, producer, csss, nr, unitOfMeasurement.value, inOperation, inStock, minimalAmount, replacementFrequency)

    fun copy(
        csss: Int = this.csss,
        nr: Int = this.nr,
        title: String = this.title,
        producer: String? = this.producer,
        unitOfMeasurement: UnitTypes = this.unitOfMeasurement,
        isDeleted: Boolean = this.isDeleted,
        inStock: Int = this.inStock,
        inOperation: Int = this.inOperation,
        minimalAmount: Int = this.minimalAmount,
        replacementFrequency: Int = this.replacementFrequency,
        devices: MutableList<Binding> = this.devices,
        id: Int? = this.id
    ) = Consumable(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, minimalAmount, replacementFrequency, devices, id)
}

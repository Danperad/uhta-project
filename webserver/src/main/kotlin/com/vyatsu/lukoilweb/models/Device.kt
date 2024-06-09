package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.dto.DeviceDTO
import jakarta.persistence.*

@Entity
@Table(name = "devices")
class Device(
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
    @JoinColumn(name = "device_id")
    val consumables: MutableList<Binding> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id", nullable = false)
    var id: Int? = null
) : MaterialBase(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, minimalAmount, replacementFrequency) {
    fun mapToDeviceDTO(): DeviceDTO {
        val newConsumables = consumables.filter { !it.isDeleted }.map { it.mapToBindingWithoutDevice() }.toSet()

        return mapToDeviceDTOWithoutConsumables().copy(consumables = newConsumables)
    }

    fun mapToDeviceDTOWithoutConsumables() =
        DeviceDTO(id, title, producer, csss, nr, unitOfMeasurement.value, inOperation, inStock, minimalAmount, replacementFrequency, emptySet())

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
        consumables: MutableList<Binding> = this.consumables,
        id: Int? = this.id
    ) = Device(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, minimalAmount, replacementFrequency, consumables, id)
}

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

    @OneToMany(mappedBy = "device")
    val consumables: MutableList<Binding> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id", nullable = false)
    var id: Int? = null
) : MaterialBase(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation) {
    fun mapToDeviceDTO(): DeviceDTO {
        val newConsumables = consumables.map { it.mapToBindingWithoutDevice() }.toSet()

        return mapToDeviceDTOWithoutConsumables().copy(consumables = newConsumables)
    }

    fun mapToDeviceDTOWithoutConsumables() =
        DeviceDTO(id, title, producer, csss, nr, unitOfMeasurement.value, inOperation, inStock, emptySet())

    fun copy(
        csss: Int = this.csss,
        nr: Int = this.nr,
        title: String = this.title,
        producer: String? = this.producer,
        unitOfMeasurement: UnitTypes = this.unitOfMeasurement,
        isDeleted: Boolean = this.isDeleted,
        inStock: Int = this.inStock,
        inOperation: Int = this.inOperation,
        consumables: MutableList<Binding> = this.consumables,
        id: Int? = this.id
    ) = Device(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, consumables, id)
}

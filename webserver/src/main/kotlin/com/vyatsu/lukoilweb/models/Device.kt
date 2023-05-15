package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "devices")
class Device(
    @Column(name = "csss")
    val csss: Int,

    @Column(name = "nr_3")
    val nr: Int,

    @Column(name = "title")
    val title: String,

    @Column(name = "producer")
    val producer: String?,

    @Column(name = "unit_of_measurement")
    @Convert(converter = UnitTypeConverter::class)
    val unitOfMeasurement: UnitTypes,

    @Column(name = "is_deleted")
    val isDeleted: Boolean = false,

    @Column(name = "count_in_stock")
    val inStock: Int = 0,

    @Column(name = "count_in_operation")
    val inOperation: Int = 0,

    @ManyToMany
    @JoinTable(
        name = "binding",
        joinColumns = [JoinColumn(name = "device_id")],
        inverseJoinColumns = [JoinColumn(name = "consumables_id")]
    )
    val consumables: MutableList<Consumable> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id", nullable = false)
    var id: Int? = null
) : Material {
    fun mapToDeviceDTO(): DeviceDTO {
        val newConsumables = consumables.map { it.mapToConsumableDTOWithoutDevices() }.toSet()

        return mapToDeviceDTOWithoutConsumables().copy(consumables = newConsumables)
    }

    fun mapToDeviceDTOWithoutConsumables() =
        DeviceDTO(id!!, title, producer, csss, nr, unitOfMeasurement.value, inOperation, inStock, emptySet())

    fun copy(
        csss: Int = this.csss,
        nr: Int = this.nr,
        title: String = this.title,
        producer: String? = this.producer,
        unitOfMeasurement: UnitTypes = this.unitOfMeasurement,
        isDeleted: Boolean = this.isDeleted,
        inStock: Int = this.inStock,
        inOperation: Int = this.inOperation,
        consumables: MutableList<Consumable> = this.consumables,
        id: Int? = this.id
    ) = Device(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, consumables, id)
}

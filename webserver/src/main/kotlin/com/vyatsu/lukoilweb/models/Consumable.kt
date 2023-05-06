package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "consumables")
class Consumable(
    @Column(name = "csss")
    val csss: Int,

    @Column(name = "nr_3")
    val nr: Int,

    @Column(name = "title")
    val title: String,

    @Column(name = "producer")
    val producer: String,

    @Column(name = "unit_of_measurement")
    val unitOfMeasurement: String,

    @Column(name = "is_deleted")
    val isDeleted: Boolean = false,

    @Column(name = "count_in_stock")
    val inStock: Int = 0,

    @Column(name = "count_in_operation")
    val inOperation: Int = 0,

    @ManyToMany(cascade = [CascadeType.ALL])
    @JoinTable(
        name = "binding",
        joinColumns = [JoinColumn(name = "consumables_id")],
        inverseJoinColumns = [JoinColumn(name = "device_id")],
    )
    val devices: MutableList<Device> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consumables_id", nullable = false)
    var id: Int? = null
) : Material {
    fun toConsumableModel() : ConsumableModel{
        val newDevices = devices.map { it.toDeviceWithoutConsumables() }.toSet()
        return toConsumableModelWithoutDevices().copy(devices = newDevices)
    }
    fun toConsumableModelWithoutDevices() = ConsumableModel(id, title, producer, csss, nr,unitOfMeasurement, inOperation, inStock)
    fun copy(
        csss: Int = this.csss,
        nr: Int = this.nr,
        title: String = this.title,
        producer: String = this.producer,
        unitOfMeasurement: String = this.unitOfMeasurement,
        isDeleted: Boolean = this.isDeleted,
        inStock: Int = this.inStock,
        inOperation: Int = this.inOperation,
        devices: MutableList<Device> = this.devices,
        id: Int? = this.id
    ) = Consumable(csss, nr, title, producer, unitOfMeasurement, isDeleted, inStock, inOperation, devices, id)
}

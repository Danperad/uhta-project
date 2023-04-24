package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "devices")
data class Device(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    val id: Int,

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

    @ManyToMany
    @JoinTable(
        name = "binding",
        joinColumns = [JoinColumn(name = "device_id")],
        inverseJoinColumns = [JoinColumn(name = "consumables_id")]
    )
    val consumables: List<Consumable> = listOf()
) {
    fun toDeviceModel(): DeviceModel {
        val newConsumables = mutableSetOf<ConsumableModel>()
        consumables.forEach {
            newConsumables.add(it.toConsumableModel())
        }

        return DeviceModel(id, title, producer, csss, nr, inOperation, inStock, newConsumables)
    }
}

package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "materials")
data class Material(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    val id: Int,

    @Column(name = "csss")
    val csss: Int,

    @Column(name = "nr_3")
    val nr: Int,

    @Column(name = "title")
    val title: String,

    @Column(name = "producer")
    val producer: String,

    @Column(name = "material_type")
    val materialType: String,

    @Column(name = "unit_of_measurement")
    val unitOfMeasurement: String,

    @Column(name = "id_deleted")
    val isDeleted: Boolean = false,

    @Column(name = "count_in_stock")
    val inStock: Int = 0,

    @Column(name = "count_in_operation")
    val inOperation: Int = 0,
    @ManyToMany
    @JoinTable(
        name = "binding",
        joinColumns = [JoinColumn(name = "device_id")],
        inverseJoinColumns = [JoinColumn(name = "material_id")]
    )
    val devices: Set<Material>,
    @ManyToMany
    @JoinTable(
        name = "binding",
        joinColumns = [JoinColumn(name = "consumable_id")],
        inverseJoinColumns = [JoinColumn(name = "material_id")]
    )
    val consumables: Set<Material>
) {
    fun convertToDevice(): Device {
        val newDevice = Device(id, title, producer, csss, nr, inOperation, inStock, mutableSetOf())
        consumables.forEach {
            newDevice.consumables.add(it.convertToConsumable(csss))
        }
        return newDevice
    }

    fun convertToConsumable(deviceCsss: Int): Consumable {
        return Consumable(id, title, producer, csss, deviceCsss, nr, inOperation, inStock)
    }
}

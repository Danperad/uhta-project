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

    @Column(name = "unit_of_measurement")
    val unitOfMeasurement: String,

    @Column(name = "deleted")
    val isDeleted: Boolean = false,

    @Column(name = "consumable_count_in_stock")
    val consumableCountInStock: Int = 0,

    @Column(name = "consumable_count_in_operation")
    val consumableCountInOperation: Int = 0
)

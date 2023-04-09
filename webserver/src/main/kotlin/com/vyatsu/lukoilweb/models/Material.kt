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

    @Column(name = "unit_of_measurement")
    val unitOfMeasurement: String,

    @Column(name = "id_deleted")
    val isDeleted: Boolean = false,

    @Column(name = "count_in_stock")
    val inStock: Int = 0,

    @Column(name = "count_in_operation")
    val inOperation: Int = 0
)

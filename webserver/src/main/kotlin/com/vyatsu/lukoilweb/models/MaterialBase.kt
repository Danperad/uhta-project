package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.utils.UnitTypeConverter
import jakarta.persistence.Column
import jakarta.persistence.Convert
import jakarta.persistence.MappedSuperclass

@MappedSuperclass
abstract class MaterialBase(
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
)
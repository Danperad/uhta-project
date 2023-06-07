package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name="reports")
class Report(
    @Column(name = "file_name")
    val fileName: String,

    @Column(name = "date_from")
    val dateFrom: Date,

    @Column(name = "date_before")
    val dateBefore: Date,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id", nullable = false)
    var id: Int? = null
)

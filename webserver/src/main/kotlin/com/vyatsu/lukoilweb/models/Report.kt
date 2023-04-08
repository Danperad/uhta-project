package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name="reports")
data class Report(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    val id: Int,

    @Column(name = "file_name")
    val fileName: String,

    @Column(name = "date_from")
    val dateFrom: Date,

    @Column(name = "date_before")
    val dateBefore: Date
)

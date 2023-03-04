package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "device")
data class Device(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    val id: Int,

    @Column(name = "csss")
    val csss: Int,

    @Column(name = "nr_3")
    val nr: Int,

    @Column(name = "device_count")
    val count: Int
)

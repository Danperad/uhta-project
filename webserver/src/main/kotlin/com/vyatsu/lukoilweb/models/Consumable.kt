package com.vyatsu.lukoilweb.models

import jakarta.persistence.*

@Entity
@Table(name = "consumable")
data class Consumable(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consumable_id")
    val id: Int,

    @ManyToOne
    @JoinColumn(name = "device_id")
    val device: Device,

    @Column(name = "csss")
    val csss: Int,

    @Column(name = "nr_3")
    val nr: Int,

    @Column(name = "consumable_count")
    val count: Int
)

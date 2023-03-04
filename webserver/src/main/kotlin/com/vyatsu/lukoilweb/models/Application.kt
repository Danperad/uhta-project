package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "application")
data class Application(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    val id: Int,
    @Column(name = "application_date")
    val date: Date,
    @Column(name = "application_period")
    val period: String,
    @ManyToMany
    @JoinTable(
        name = "consumable_application",
        joinColumns = [JoinColumn(name = "consumable_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val consumables: Set<Consumable>,
    @ManyToMany
    @JoinTable(
        name = "device_application",
        joinColumns = [JoinColumn(name = "device_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val devices: Set<Device>
)

package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "applications")
data class Application(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    val number: Int,
    @Column(name = "application_date")
    val date: Date,
    @Column(name = "title")
    val title: String,
    @Column(name = "application_period")
    val period: Long,
    @Column(name = "applications_status")
    val status: String,
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "devices_application",
        joinColumns = [JoinColumn(name = "device_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val devices: List<Device> = listOf(),
    @ManyToMany
    @JoinTable(
        name = "consumables_application",
        joinColumns = [JoinColumn(name = "consumables_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val consumables: List<Consumable> = listOf()
) {
    fun convertToModel(): ApplicationModel {
        val newDevices = this.devices.map { it.toDeviceModel() }.toSet()
        val newConsumables = this.consumables.map { it.toConsumableModel() }.toSet()
        return ApplicationModel(number, date.time, title, period, status, newDevices, newConsumables)
    }
}

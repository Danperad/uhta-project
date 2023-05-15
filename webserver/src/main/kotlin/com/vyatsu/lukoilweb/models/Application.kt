package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.*
import kotlin.time.Duration
import kotlin.time.DurationUnit

@Entity
@Table(name = "applications")
class Application(
    @Column(name = "application_date")
    val date: Date,
    @Column(name = "title")
    val title: String,
    @Column(name = "application_period")
    val period: Duration,
    @Column(name = "applications_status")
    @Convert(converter = ApplicationStatusConverter::class)
    val status: ApplicationStatuses,
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
    val consumables: List<Consumable> = listOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false)
    var number: Int? = null
) {
    fun mapToApplicationDTO(): ApplicationDTO {
        val newDevices = this.devices.map { it.mapToDeviceDTOWithoutConsumables() }.toSet()
        val newConsumables = this.consumables.map { it.mapToConsumableDTOWithoutDevices() }.toSet()
        return ApplicationDTO(number!!, date.time, title, period.toLong(DurationUnit.SECONDS), status.value, newDevices, newConsumables)
    }
}

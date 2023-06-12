package com.vyatsu.lukoilweb.models.application

import com.vyatsu.lukoilweb.models.dto.ApplicationConsumableDTO
import com.vyatsu.lukoilweb.models.dto.ApplicationDTO
import com.vyatsu.lukoilweb.models.dto.ApplicationDeviceDTO
import com.vyatsu.lukoilweb.utils.ApplicationStatusConverter
import jakarta.persistence.*
import java.time.Duration
import java.util.*


@Entity
@Table(name = "applications")
class Application(
    @Column(name = "application_date")
    val date: Date,
    @Column(name = "title")
    val title: String,
    @Column(name = "application_period")
    val period: Duration?,
    @Column(name = "applications_status")
    @Convert(converter = ApplicationStatusConverter::class)
    val status: ApplicationStatuses,
    @OneToMany(mappedBy = "application")
    val devices: List<ApplicationDevice> = listOf(),
    @OneToMany(mappedBy = "application")
    val consumables: List<ApplicationConsumable> = listOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false)
    var number: Int? = null
) {
    fun mapToApplicationDTO(): ApplicationDTO {
        val newDevices = this.devices.map {
            ApplicationDeviceDTO(
                number,
                it.device.mapToDeviceDTOWithoutConsumables(),
                it.deviceCount
            )
        }.toSet()
        val newConsumables = this.consumables.map {
            ApplicationConsumableDTO(
                number,
                it.consumable.mapToConsumableDTOWithoutDevices(),
                it.consumableCount
            )
        }.toSet()
        return ApplicationDTO(number!!, date.time, title, period?.seconds, status.value, newDevices, newConsumables)
    }
}

package com.vyatsu.lukoilweb.models

import com.vyatsu.lukoilweb.models.application.ApplicationConsumable
import com.vyatsu.lukoilweb.models.application.ApplicationDevice
import com.vyatsu.lukoilweb.models.application.ApplicationStatuses
import com.vyatsu.lukoilweb.utils.ApplicationStatusConverter
import jakarta.persistence.*
import java.time.Duration
import java.util.*

@Entity
@Table(name = "logs")
class Logs(
    @Column(name = "user_login")
    val user_login: String,
    @Column(name = "action")
    val action: String,
    @Column(name = "log_date")
    val date: Date,

    @Column(name = "title")
    val title: String,
    @Column(name = "application_period")
    var period: Duration?,
    @Column(name = "applications_status")
    @Convert(converter = ApplicationStatusConverter::class)
    val status: ApplicationStatuses,
    @OneToMany(mappedBy = "application")
    val devices: MutableList<ApplicationDevice> = mutableListOf(),
    @OneToMany(mappedBy = "application")
    val consumables: MutableList<ApplicationConsumable> = mutableListOf(),
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false)
    var number: Int? = null,
    @Column(name = "in_archive")
    val inArchive: Boolean = false,
    @Column(name = "is_deleted")
    val isDeleted: Boolean = false
)
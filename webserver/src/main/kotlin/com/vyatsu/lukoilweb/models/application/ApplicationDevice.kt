package com.vyatsu.lukoilweb.models.application

import com.vyatsu.lukoilweb.models.Device
import jakarta.persistence.*

@Entity
@Table(name = "devices_application")
class ApplicationDevice (
    @EmbeddedId
    val deviceKey: ApplicationDeviceKey,
    @ManyToOne
    @MapsId("deviceId")
    @JoinColumn(name = "device_id")
    val device: Device,

    @ManyToOne
    @MapsId("applicationNumber")
    @JoinColumn(name = "application_id")
    val application: Application,

    @Column(name = "material_count")
    val deviceCount: Int
)
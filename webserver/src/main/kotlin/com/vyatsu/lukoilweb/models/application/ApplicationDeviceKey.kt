package com.vyatsu.lukoilweb.models.application

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import kotlinx.serialization.Serializable

@Embeddable
@Serializable
class ApplicationDeviceKey(
    @Column(name = "device_id")
    val deviceId: Int,
    @Column(name = "application_id")
    val applicationNumber: Int,
) : java.io.Serializable
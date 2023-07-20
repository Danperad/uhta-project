package com.vyatsu.lukoilweb.models.application

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import kotlinx.serialization.Serializable

@Embeddable
@Serializable
class ApplicationDeviceKey(
    @Column(name = "device_id", nullable = false)
    val deviceId: Int? = null,
    @Column(name = "application_id", nullable = false)
    val applicationNumber: Int? = null,
) : java.io.Serializable{
    fun copy(
        deviceId: Int? = this.deviceId,
        applicationNumber: Int? = this.applicationNumber
    ): ApplicationDeviceKey{
        return ApplicationDeviceKey(deviceId, applicationNumber)
    }
}
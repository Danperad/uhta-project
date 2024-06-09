package com.vyatsu.lukoilweb.models.application

import com.vyatsu.lukoilweb.models.Device
import jakarta.persistence.*

@Entity
@Table(name = "devices_application")
class ApplicationDevice (
    @EmbeddedId
    val deviceKey: ApplicationDeviceKey = ApplicationDeviceKey(),
    @ManyToOne(optional = false)
    @MapsId("deviceId")
    @JoinColumn(name = "device_id")
    val device: Device,

    @ManyToOne(optional = false)
    @MapsId("applicationNumber")
    @JoinColumn(name = "application_id")
    val application: Application,

    @Column(name = "material_count")
    val deviceCount: Int = 0,

    @Column(name = "received_quantity")
    val receivedQuantity: Int = 0,

    @Column(name = "receipt_date")
    val receiptDate: Int = 0
){
    fun copy(
        deviceKey: ApplicationDeviceKey = this.deviceKey,
        device: Device = this.device,
        application: Application = this.application,
        deviceCount: Int = this.deviceCount,
        receivedQuantity: Int = this.receivedQuantity,
        receiptDate: Int = this.receiptDate,
    ): ApplicationDevice{
        return ApplicationDevice(deviceKey, device, application, deviceCount, receivedQuantity, receiptDate)
    }
}
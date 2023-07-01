package com.vyatsu.lukoilweb.models.application

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import kotlinx.serialization.Serializable

@Embeddable
@Serializable
class ApplicationConsumableKey(
    @Column(name = "consumables_id")
    val consumableId: Int,
    @Column(name = "application_id", nullable = false)
    val applicationNumber: Int?,
) : java.io.Serializable {
    fun copy(
        consumableId: Int = this.consumableId,
        applicationNumber: Int? = this.applicationNumber
    ): ApplicationConsumableKey {
        return ApplicationConsumableKey(consumableId, applicationNumber)
    }
}
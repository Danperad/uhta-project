package com.vyatsu.lukoilweb.models.application

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import kotlinx.serialization.Serializable

@Embeddable
@Serializable
class ApplicationConsumableKey(
    @Column(name = "consumables_id")
    val consumableId: Int,
    @Column(name = "application_id")
    val applicationNumber: Int,
) : java.io.Serializable
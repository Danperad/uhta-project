package com.vyatsu.lukoilweb.models.application

import com.vyatsu.lukoilweb.models.Consumable
import jakarta.persistence.*

@Entity
@Table(name = "consumables_application")
class ApplicationConsumable(
    @EmbeddedId
    val consumableKey: ApplicationConsumableKey,
    @ManyToOne
    @MapsId("consumableId")
    @JoinColumn(name = "consumables_id")
    val consumable: Consumable,

    @ManyToOne
    @MapsId("applicationNumber")
    @JoinColumn(name = "application_id")
    val application: Application,

    @Column(name = "material_count")
    val consumableCount: Int
)
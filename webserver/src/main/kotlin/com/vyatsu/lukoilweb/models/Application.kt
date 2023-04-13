package com.vyatsu.lukoilweb.models

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "applications")
data class Application(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    val number: Int,
    @Column(name = "application_date")
    val date: Date,
    @Column(name = "title")
    val title: String,
    @Column(name = "application_period")
    val period: Long,
    @Column(name = "applications_status")
    val status: String,
    @ManyToMany
    @JoinTable(
        name = "materials_application",
        joinColumns = [JoinColumn(name = "material_id")],
        inverseJoinColumns = [JoinColumn(name = "application_id")]
    )
    val materials: Set<Material>
){
    fun convertToModel() : ApplicationModel{
        val consumables = mutableSetOf<Consumable>()
        materials.forEach {
            consumables.add(it.convertToConsumable(1))
        }
        return ApplicationModel(number, date.time, title, period, status, consumables)
    }
}

package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class Consumable(
    val id: Int,
    val title: String,
    val prducer: String,
    val csss: Int,
    val parentCsss: Int,
    val nr3: Int,
    val inOperation: Int,
    val inStock: Int,
)

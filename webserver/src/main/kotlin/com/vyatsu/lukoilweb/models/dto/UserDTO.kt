package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class UserDTO(
    val userId: Int,
    val login: String,
    val lastName: String,
    val firstName: String,
    val middleName: String? = null
)
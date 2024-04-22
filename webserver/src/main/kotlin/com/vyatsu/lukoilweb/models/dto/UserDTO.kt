package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class UserDTO(
    val id: Int? = null,
    val login: String,
    val lastName: String,
    val firstName: String,
    val middleName: String? = null,
    val role: String,
    val isDeleted: Boolean
)
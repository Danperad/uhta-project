package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class UserModel(
    val userId: Int,
    val login: String,
    val lastName: String,
    val firstName: String,
    val middleName: String?
)

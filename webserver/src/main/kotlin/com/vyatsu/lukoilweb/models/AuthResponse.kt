package com.vyatsu.lukoilweb.models

import kotlinx.serialization.Serializable

@Serializable
data class AuthResponse(
    val accessToken: String,
    val refreshToken: String
)

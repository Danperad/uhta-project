package com.vyatsu.lukoilweb.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class AuthModel(val login: String, val password: String)

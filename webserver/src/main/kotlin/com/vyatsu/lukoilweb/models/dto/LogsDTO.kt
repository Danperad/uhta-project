package com.vyatsu.lukoilweb.models.dto

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable

@Serializable
data class LogsDTO(
    val id: Int? = null,
    val user_login: String,
    val action: String,
    val status: String,
    val result: String,
    val element_number: Int? = null,
    val date: Instant
)
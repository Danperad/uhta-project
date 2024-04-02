package com.vyatsu.lukoilweb.models.dto

import com.vyatsu.lukoilweb.models.User
import com.vyatsu.lukoilweb.utils.RoleConverter
import kotlinx.serialization.Serializable

@Serializable
data class NewUserDTO(
    val id: Int? = null,
    val login: String,
    val password: String,
    val lastName: String,
    val firstName: String,
    val middleName: String? = null,
    val role: String,
    val isDeleted: Boolean
){
    fun mapToUser(): User {
        val user = User(
            login,
            password,
            lastName,
            firstName,
            middleName,
            RoleConverter().convertToEntityAttribute(role),
            isDeleted,
            id = id
        )
        return user
    }
}

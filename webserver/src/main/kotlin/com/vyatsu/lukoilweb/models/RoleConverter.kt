package com.vyatsu.lukoilweb.models

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.util.NoSuchElementException

@Converter
class RoleConverter :AttributeConverter<Roles, String> {
    override fun convertToDatabaseColumn(attribute: Roles?): String {
        return attribute?.value ?: throw NullPointerException()
    }

    override fun convertToEntityAttribute(dbData: String?): Roles {
        return when (dbData){
            "ADMIN" -> Roles.ADMIN
            "WORKER" -> Roles.WORKER
            "GUEST" -> Roles.GUEST
            else -> throw NoSuchElementException()
        }
    }
}
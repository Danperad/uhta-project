package com.vyatsu.lukoilweb.utils

import com.vyatsu.lukoilweb.models.application.ApplicationStatuses
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.util.NoSuchElementException

@Converter(autoApply = true)
class ApplicationStatusConverter : AttributeConverter<ApplicationStatuses, String> {
    override fun convertToDatabaseColumn(attribute: ApplicationStatuses?): String {
        return attribute?.value ?: throw NullPointerException()
    }

    override fun convertToEntityAttribute(dbData: String?): ApplicationStatuses {
        return when (dbData){
            "Новая" -> ApplicationStatuses.NEW
            "На согласование" -> ApplicationStatuses.ON_APPROVAL
            "Согласована" -> ApplicationStatuses.AGREED
            else -> throw NoSuchElementException()
        }
    }
}
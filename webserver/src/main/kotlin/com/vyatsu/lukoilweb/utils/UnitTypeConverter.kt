package com.vyatsu.lukoilweb.utils

import com.vyatsu.lukoilweb.models.UnitTypes
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter
class UnitTypeConverter : AttributeConverter<UnitTypes, String> {
    override fun convertToDatabaseColumn(attribute: UnitTypes?): String {
        return attribute?.value ?: ""
    }

    override fun convertToEntityAttribute(dbData: String?): UnitTypes {
        return when (dbData){
            "ШТ" -> UnitTypes.PC
            "КМП" -> UnitTypes.ILC
            "М" -> UnitTypes.M
            "УПК" -> UnitTypes.UPC
            "КГ" -> UnitTypes.KG
            "Т" -> UnitTypes.T
            "М2" -> UnitTypes.M2
            "РУЛ" -> UnitTypes.RUL
            else -> throw NoSuchElementException()
        }
    }
}
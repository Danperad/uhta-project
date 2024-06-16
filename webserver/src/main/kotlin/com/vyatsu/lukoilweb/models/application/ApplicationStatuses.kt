package com.vyatsu.lukoilweb.models.application

enum class ApplicationStatuses(val value: String) {
    NEW("Новая"),
    AGREED("Согласована"),
    COMPLETED("Завершена"),
    IN_ARCHIVE("В архиве")
}